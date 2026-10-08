import { ConfigurationError, IPFSError } from '@core/errors/domain-error'
import type { IIPFSRepository, IPFSMetadata, IPFSPinResult } from '@core/interfaces/ipfs.repository.interface'
import type { IpfsCid } from '@core/value-objects/ipfs-cid.vo'
import { IpfsCid as IpfsCidClass } from '@core/value-objects/ipfs-cid.vo'
import type { Uri } from '@core/value-objects/uri.vo'
import { Uri as UriClass } from '@core/value-objects/uri.vo'
import type { UploadResponse } from 'pinata'
import { PinataSDK } from 'pinata'

/**
 * Configuration options for Pinata IPFS service.
 */
interface PinataConfig {
  readonly gateway: string
  /** Returns a signed upload URL from the API, which holds the Pinata JWT */
  readonly getUploadUrl: () => Promise<string>
}

/**
 * Implementation of IIPFSRepository using Pinata as the IPFS pinning service.
 *
 * Handles uploading files and metadata to IPFS through Pinata's API,
 * fetching content via Pinata's gateway, and managing pinned content.
 * Used for storing NFT metadata and images on decentralized storage.
 *
 * @see {@link https://docs.pinata.cloud/} Pinata Documentation
 */
export class PinataIPFSRepository implements IIPFSRepository {
  private readonly pinata: PinataSDK
  private readonly gateway: string
  private readonly getUploadUrl: () => Promise<string>
  constructor(config: PinataConfig) {
    if (!config.gateway) {
      throw new ConfigurationError('Pinata Gateway is required for IPFS repository')
    }
    this.gateway = config.gateway
    this.getUploadUrl = config.getUploadUrl
    this.pinata = new PinataSDK({
      pinataJwt: '',
      pinataGateway: this.gateway
    })
  }
  async uploadFile(file: File): Promise<IPFSPinResult> {
    try {
      const upload = await this.pinata.upload.public
        .file(file, {
          metadata: {
            name: file.name
          }
        })
        .url(await this.getUploadUrl())
      return {
        cid: IpfsCidClass.create(upload.cid),
        url: UriClass.create(`https://${this.gateway}/ipfs/${upload.cid}`)
      }
    } catch (error) {
      throw new IPFSError(error instanceof Error ? error.message : 'Failed to upload file to IPFS')
    }
  }
  async uploadMetadata(metadata: IPFSMetadata, filename: string): Promise<IPFSPinResult> {
    try {
      const jsonString = JSON.stringify(metadata, null, 2)
      const baseFilename = filename
      const metadataFile = new File([jsonString], `${baseFilename}-metadata.json`, {
        type: 'application/json'
      })
      const upload: UploadResponse = await this.pinata.upload.public.file(metadataFile).url(await this.getUploadUrl())
      return {
        cid: IpfsCidClass.create(upload.cid),
        url: UriClass.create(`https://${this.gateway}/ipfs/${upload.cid}`)
      }
    } catch (error) {
      throw new IPFSError(error instanceof Error ? error.message : 'Failed to upload metadata to IPFS')
    }
  }
  async getContent(cid: IpfsCid): Promise<string> {
    try {
      const url = `https://${this.gateway}/ipfs/${cid.value}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new IPFSError(`Failed to fetch content from IPFS: ${response.statusText}`)
      }
      const content = await response.text()
      return content
    } catch (error) {
      throw new IPFSError(error instanceof Error ? error.message : 'Failed to get content from IPFS')
    }
  }
  async getMetadata(cid: IpfsCid): Promise<IPFSMetadata> {
    try {
      const content = await this.getContent(cid)
      const metadata = JSON.parse(content) as IPFSMetadata
      return metadata
    } catch (error) {
      throw new IPFSError(error instanceof Error ? error.message : 'Failed to parse metadata from IPFS')
    }
  }
  async fetchMetadata(tokenURI: Uri): Promise<IPFSMetadata> {
    try {
      const metadataUrl = this.toGatewayUrl(tokenURI)
      const response = await fetch(metadataUrl)
      if (!response.ok) {
        throw new IPFSError(`Failed to fetch metadata: ${response.statusText}`)
      }
      const metadata = (await response.json()) as IPFSMetadata
      return metadata
    } catch (error) {
      throw new IPFSError(error instanceof Error ? error.message : 'Failed to fetch metadata from IPFS')
    }
  }
  toGatewayUrl(uri: Uri): string {
    if (uri.value.startsWith('http://') || uri.value.startsWith('https://')) {
      return uri.value
    }
    const cid = uri.value.replace('ipfs://', '')
    return `https://${this.gateway}/ipfs/${cid}`
  }
  async isPinned(cid: IpfsCid): Promise<boolean> {
    try {
      await this.getContent(cid)
      return true
    } catch {
      return false
    }
  }
  async unpin(_cid: IpfsCid): Promise<void> {
    throw new IPFSError('Unpin operation not supported by Pinata SDK')
  }
}
