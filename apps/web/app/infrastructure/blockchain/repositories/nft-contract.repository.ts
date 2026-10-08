import { ERC721_NONEXISTENT_TOKEN_ERROR } from '@core/constants/blockchain.constants'
import { NFT } from '@core/entities/nft.entity'
import { ContractError, NotFoundError, UserRejectedError } from '@core/errors/domain-error'
import { isUserRejectedError } from '@core/errors/error-helpers'
import type { INFTRepository } from '@core/interfaces/nft.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync, isFailure } from '@core/interfaces/result.type'
import type { Address } from '@core/value-objects/address.vo'
import { Address as AddressClass } from '@core/value-objects/address.vo'
import type { AssetId } from '@core/value-objects/asset-id.vo'
import { AssetId as AssetIdClass } from '@core/value-objects/asset-id.vo'
import type { TokenId } from '@core/value-objects/token-id.vo'
import { TokenId as TokenIdClass } from '@core/value-objects/token-id.vo'
import type { Uri } from '@core/value-objects/uri.vo'
import { Uri as UriClass } from '@core/value-objects/uri.vo'
import { ASSET_NFT_ABI } from '@infrastructure/blockchain/contracts/abis'
import { extractMintedTokenId } from '@infrastructure/blockchain/utils/event-parser'
import type { Config } from '@wagmi/core'
import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core'

/**
 * Raw NFT data structure returned from smart contract calls.
 */
interface NFTDataStruct {
  tokenId: bigint
  owner: string
  tokenURI: string
  assetId: bigint
  exists: boolean
}

/**
 * Implementation of INFTRepository using the AssetNFT smart contract.
 *
 * Provides methods for minting NFTs from game assets, querying NFT ownership,
 * managing approvals, and retrieving user inventories from the blockchain.
 */
export class NFTContractRepository implements INFTRepository {
  private readonly contractAddress: `0x${string}`
  private readonly config: Config
  constructor(contractAddress: `0x${string}`, config: Config) {
    this.contractAddress = contractAddress
    this.config = config
  }
  async mint(params: {
    assetId: AssetId
    tokenURI: Uri
    to: Address
  }): Promise<{ tokenId: TokenId; hash: `0x${string}` }> {
    try {
      const hash = await writeContract(this.config, {
        address: this.contractAddress,
        abi: ASSET_NFT_ABI,
        functionName: 'mint',
        args: [params.tokenURI.value, BigInt(params.assetId.value)]
      })
      const receipt = await waitForTransactionReceipt(this.config, { hash })
      if (receipt.status !== 'success') {
        throw new ContractError('NFT minting transaction failed')
      }
      const extractedTokenId = extractMintedTokenId(receipt.logs, ASSET_NFT_ABI)
      const tokenId = TokenIdClass.create(extractedTokenId)
      return { tokenId, hash }
    } catch (error) {
      if (isUserRejectedError(error)) {
        throw new UserRejectedError()
      }
      throw new ContractError(error instanceof Error ? error.message : 'Failed to mint NFT')
    }
  }
  async getById(tokenId: TokenId): Promise<NFT> {
    try {
      const tokenURIResult = await this.getTokenURI(tokenId)
      const owner = await this.getOwner(tokenId)
      const assetIdResult = await this.getAssetId(tokenId)
      if (isFailure(tokenURIResult) || isFailure(assetIdResult)) {
        throw new NotFoundError('NFT not found')
      }
      const nft = NFT.create({
        tokenId,
        owner,
        tokenURI: UriClass.create(tokenURIResult.value),
        assetId: AssetIdClass.create(assetIdResult.value)
      })
      return nft
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new ContractError(error instanceof Error ? error.message : 'Failed to get NFT')
    }
  }
  async getTotalSupply(): Promise<number> {
    try {
      const totalMinted = await readContract(this.config, {
        address: this.contractAddress,
        abi: ASSET_NFT_ABI,
        functionName: 'totalMinted'
      })
      return Number(totalMinted)
    } catch (error) {
      throw new ContractError(error instanceof Error ? error.message : 'Failed to get total supply')
    }
  }
  async getOwner(tokenId: TokenId): Promise<Address> {
    try {
      const owner = await readContract(this.config, {
        address: this.contractAddress,
        abi: ASSET_NFT_ABI,
        functionName: 'ownerOf',
        args: [BigInt(tokenId.value)]
      })
      return AddressClass.create(owner as string)
    } catch (error) {
      if (error instanceof Error && error.message.includes(ERC721_NONEXISTENT_TOKEN_ERROR)) {
        throw new ContractError(`Token ${tokenId.value} does not exist`)
      }
      throw new ContractError(error instanceof Error ? error.message : 'Failed to get NFT owner')
    }
  }
  async approve(params: { to: Address; tokenId: TokenId }): Promise<{ hash: `0x${string}` }> {
    try {
      const hash = await writeContract(this.config, {
        address: this.contractAddress,
        abi: ASSET_NFT_ABI,
        functionName: 'approve',
        args: [params.to.value as `0x${string}`, BigInt(params.tokenId.value)]
      })
      const receipt = await waitForTransactionReceipt(this.config, { hash })
      if (receipt.status !== 'success') {
        throw new ContractError('NFT approval transaction failed')
      }
      return { hash }
    } catch (error) {
      if (isUserRejectedError(error)) {
        throw new UserRejectedError()
      }
      throw new ContractError(error instanceof Error ? error.message : 'Failed to approve NFT')
    }
  }
  async getApproved(tokenId: TokenId): Promise<Address | null> {
    try {
      const approved = await readContract(this.config, {
        address: this.contractAddress,
        abi: ASSET_NFT_ABI,
        functionName: 'getApproved',
        args: [BigInt(tokenId.value)]
      })
      if (!approved || approved === '0x0000000000000000000000000000000000000000') {
        return null
      }
      return AddressClass.create(approved as string)
    } catch (error) {
      throw new ContractError(error instanceof Error ? error.message : 'Failed to get approved address')
    }
  }
  async getUserInventory(address: Address): Promise<NFT[]> {
    try {
      const inventory = await readContract(this.config, {
        address: this.contractAddress,
        abi: ASSET_NFT_ABI,
        functionName: 'getUserInventory',
        args: [address.value as `0x${string}`]
      })
      const nftDataArray = inventory as unknown as NFTDataStruct[]
      return nftDataArray.map((data) => this.mapNFTDataToEntity(data))
    } catch (error) {
      throw new ContractError(error instanceof Error ? error.message : 'Failed to get user inventory')
    }
  }
  async getBatch(tokenIds: TokenId[]): Promise<NFT[]> {
    try {
      if (tokenIds.length === 0) {
        return []
      }
      const tokenIdsBigInt = tokenIds.map((id) => BigInt(id.value))
      const nftDataArray = await readContract(this.config, {
        address: this.contractAddress,
        abi: ASSET_NFT_ABI,
        functionName: 'getBatchNFTData',
        args: [tokenIdsBigInt]
      })
      const nftData = nftDataArray as unknown as NFTDataStruct[]
      return nftData.map((data) => this.mapNFTDataToEntity(data))
    } catch (error) {
      throw new ContractError(error instanceof Error ? error.message : 'Failed to get batch NFT data')
    }
  }
  private async getTokenURI(tokenId: TokenId): Promise<Result<string, Error>> {
    return executeAsync(async () => {
      const uri = await readContract(this.config, {
        address: this.contractAddress,
        abi: ASSET_NFT_ABI,
        functionName: 'tokenURI',
        args: [BigInt(tokenId.value)]
      })
      return uri as string
    })
  }
  private async getAssetId(tokenId: TokenId): Promise<Result<number, Error>> {
    return executeAsync(async () => {
      const assetId = await readContract(this.config, {
        address: this.contractAddress,
        abi: ASSET_NFT_ABI,
        functionName: 'assetIdOf',
        args: [BigInt(tokenId.value)]
      })
      return Number(assetId)
    })
  }
  private mapNFTDataToEntity(data: NFTDataStruct): NFT {
    return NFT.create({
      tokenId: TokenIdClass.create(Number(data.tokenId)),
      owner: AddressClass.create(data.owner),
      tokenURI: UriClass.create(data.tokenURI),
      assetId: AssetIdClass.create(Number(data.assetId))
    })
  }
}
