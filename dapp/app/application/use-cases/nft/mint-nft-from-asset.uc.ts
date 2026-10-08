import { ValidationError } from '@core/errors/domain-error'
import type { IAPIRepository } from '@core/interfaces/api.repository.interface'
import type { IIPFSRepository, IPFSMetadata } from '@core/interfaces/ipfs.repository.interface'
import type { INFTRepository } from '@core/interfaces/nft.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'
import { Address } from '@core/value-objects/address.vo'
import { AssetId } from '@core/value-objects/asset-id.vo'
import { TokenId } from '@core/value-objects/token-id.vo'

/**
 * Parameters for minting an NFT from a game asset.
 */
interface MintNFTFromAssetParams {
  readonly assetId: string
  readonly recipient: string
}

/**
 * Result of a successful NFT minting operation.
 */
interface MintNFTFromAssetResult {
  readonly tokenId: TokenId
  readonly transactionHash: `0x${string}`
  readonly ipfsUrl: string
}

/**
 * Use case for minting an NFT from a game asset.
 *
 * Orchestrates the full minting flow:
 * 1. Fetches asset data from the game backend
 * 2. Uploads the asset image to IPFS
 * 3. Creates and uploads NFT metadata to IPFS
 * 4. Mints the NFT on the blockchain with the metadata URI
 * 5. Removes the original asset from the game database
 */
export class MintNFTFromAssetUseCase {
  constructor(
    private readonly nftRepository: INFTRepository,
    private readonly ipfsRepository: IIPFSRepository,
    private readonly apiRepository: IAPIRepository
  ) {}
  async execute(params: MintNFTFromAssetParams): Promise<Result<MintNFTFromAssetResult>> {
    return executeAsync(async () => {
      const assetIdNumeric = parseInt(params.assetId, 10)
      if (!Number.isFinite(assetIdNumeric) || assetIdNumeric < 0) {
        throw new ValidationError(`Invalid asset ID: ${params.assetId}`)
      }
      const assetId = AssetId.create(assetIdNumeric)
      const recipient = Address.create(params.recipient)
      const asset = await this.apiRepository.getAssetData(assetId)
      const imageBlob = await this.apiRepository.downloadImage(asset.image_path)
      const imageFile = new File([imageBlob], `${asset.uid}.png`, { type: imageBlob.type || 'image/png' })
      const imageUploadResult = await this.ipfsRepository.uploadFile(imageFile)
      const metadata: IPFSMetadata = {
        uid: asset.uid,
        name: asset.name,
        description: asset.description,
        item_type: asset.itemType,
        rarity: asset.rarity,
        image_path: imageUploadResult.url.toString(),
        attributes: asset.attributes
      }
      const metadataUploadResult = await this.ipfsRepository.uploadMetadata(metadata, String(asset.uid))
      const mintResult = await this.nftRepository.mint({
        tokenURI: metadataUploadResult.url,
        assetId,
        to: recipient
      })
      await this.apiRepository.removeAssetRecord(assetId)
      return {
        tokenId: mintResult.tokenId,
        transactionHash: mintResult.hash,
        ipfsUrl: metadataUploadResult.url.toString()
      }
    })
  }
}
