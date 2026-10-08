import { ContractError, UserRejectedError } from '@core/errors/domain-error'
import { isUserRejectedError } from '@core/errors/error-helpers'
import type { IExportManagerRepository } from '@core/interfaces/export-manager.repository.interface'
import { Address } from '@core/value-objects/address.vo'
import type { TokenId } from '@core/value-objects/token-id.vo'
import { EXPORT_MANAGER_ABI } from '@infrastructure/blockchain/contracts/abis'
import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core'

/**
 * Implementation of IExportManagerRepository using the ExportManager smart contract.
 *
 * Handles exporting NFTs to other chains or back to the game system.
 * When an NFT is exported, it is burned and recorded for recreation elsewhere.
 */
export class ExportManagerContractRepository implements IExportManagerRepository {
  private readonly contractAddress: `0x${string}`
  private readonly config: any
  constructor(contractAddress: `0x${string}`, config: any) {
    this.contractAddress = contractAddress
    this.config = config
  }
  async exportToChain(params: { tokenId: TokenId; targetChainId: number }): Promise<{ hash: `0x${string}` }> {
    try {
      const hash = await writeContract(this.config, {
        address: this.contractAddress,
        abi: EXPORT_MANAGER_ABI,
        functionName: 'exportToChain',
        args: [BigInt(params.tokenId.value), BigInt(params.targetChainId)]
      })
      const receipt = await waitForTransactionReceipt(this.config, { hash })
      if (receipt.status !== 'success') {
        throw new ContractError('Export transaction failed')
      }
      return { hash }
    } catch (error) {
      if (isUserRejectedError(error)) {
        throw new UserRejectedError()
      }
      throw new ContractError(error instanceof Error ? error.message : 'Failed to export NFT')
    }
  }
  async getExportCount(): Promise<number> {
    try {
      const count = await readContract(this.config, {
        address: this.contractAddress,
        abi: EXPORT_MANAGER_ABI,
        functionName: 'exportCount'
      })
      return Number(count)
    } catch (error) {
      throw new ContractError(error instanceof Error ? error.message : 'Failed to get export count')
    }
  }
  async getUserExportCount(address: Address): Promise<number> {
    try {
      const count = await readContract(this.config, {
        address: this.contractAddress,
        abi: EXPORT_MANAGER_ABI,
        functionName: 'getUserExportCount',
        args: [address.value as `0x${string}`]
      })
      return Number(count)
    } catch (error) {
      throw new ContractError(error instanceof Error ? error.message : 'Failed to get user export count')
    }
  }
}
