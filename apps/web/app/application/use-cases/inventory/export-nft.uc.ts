import { signApiRequest } from '@application/use-cases/auth/sign-api-request'
import type { ApiAuth } from '@core/auth/api-auth'
import type { IExportManagerRepository } from '@core/interfaces/export-manager.repository.interface'
import type { INFTRepository } from '@core/interfaces/nft.repository.interface'
import type { IWalletRepository } from '@core/interfaces/wallet.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'
import { Address } from '@core/value-objects/address.vo'
import { TokenId } from '@core/value-objects/token-id.vo'

/**
 * Parameters for exporting an NFT to another chain.
 */
interface ExportNFTParams {
  readonly tokenId: string | number
  readonly exportManagerAddress: string
  readonly userAddress: string
  readonly targetChainId?: number
  /** The game asset the token carries; when set, the wallet signs the API export request before the burn. */
  readonly assetId?: number
}

/**
 * Result of the NFT export operation.
 */
interface ExportNFTResult {
  readonly transactionHash: `0x${string}`
  readonly exported: boolean
  readonly approvalHash?: `0x${string}`
  /** The export signature for the API, when `assetId` was given. */
  readonly auth?: ApiAuth
}

/**
 * Use case for exporting an NFT to another blockchain or back to the game.
 *
 * Handles the full export flow: approving the export manager contract
 * to transfer the NFT (if needed), then calling the export function
 * which burns the NFT and records it for recreation elsewhere.
 */
export class ExportNFTUseCase {
  constructor(
    private readonly nftRepository: INFTRepository,
    private readonly exportManagerRepository: IExportManagerRepository,
    private readonly walletRepository: IWalletRepository
  ) {}
  async execute(params: ExportNFTParams): Promise<Result<ExportNFTResult>> {
    return executeAsync(async () => {
      const tokenIdValue = typeof params.tokenId === 'string' ? parseInt(params.tokenId, 10) : params.tokenId
      const tokenId = TokenId.create(tokenIdValue)
      const exportManagerAddress = Address.create(params.exportManagerAddress)
      const targetChainId = params.targetChainId || 1
      const auth =
        params.assetId === undefined
          ? undefined
          : await signApiRequest(this.walletRepository, {
              action: 'export',
              assetId: params.assetId,
              tokenId: tokenId.value
            })
      const approvedAddress = await this.nftRepository.getApproved(tokenId)
      let approvalHash: `0x${string}` | undefined
      if (!approvedAddress || !approvedAddress.equals(exportManagerAddress)) {
        const approveResult = await this.nftRepository.approve({
          to: exportManagerAddress,
          tokenId
        })
        approvalHash = approveResult.hash
      }
      const exportResult = await this.exportManagerRepository.exportToChain({
        tokenId,
        targetChainId: targetChainId
      })
      return {
        transactionHash: exportResult.hash,
        exported: true,
        approvalHash,
        auth
      }
    })
  }
}
