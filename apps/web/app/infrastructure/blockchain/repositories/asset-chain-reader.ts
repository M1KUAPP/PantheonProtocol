import type { AppConfig } from '@config/app-config.js'
import { ContractName } from '@config/app-config.js'
import type { IAssetChainReader } from '@core/interfaces/asset-chain-reader.interface'
import { ASSET_NFT_ABI, EXPORT_MANAGER_ABI } from '@infrastructure/blockchain/contracts/abis.js'
import { BaseError, ContractFunctionRevertedError, createPublicClient, http, zeroAddress } from 'viem'

/**
 * Reads token ownership and export records from the AssetNFT and ExportManager contracts over JSON-RPC.
 */
export function createAssetChainReader(appConfig: AppConfig): IAssetChainReader {
  const client = createPublicClient({ transport: http(appConfig.getNetwork().rpcUrl) })
  const assetNFT = appConfig.getContractAddress(ContractName.ASSET_NFT)
  const exportManager = appConfig.getContractAddress(ContractName.EXPORT_MANAGER)
  return {
    async getToken(tokenId) {
      try {
        const [owner, assetId] = await Promise.all([
          client.readContract({ address: assetNFT, abi: ASSET_NFT_ABI, functionName: 'ownerOf', args: [tokenId] }),
          client.readContract({ address: assetNFT, abi: ASSET_NFT_ABI, functionName: 'assetIdOf', args: [tokenId] })
        ])
        return { owner, assetId }
      } catch (error) {
        // ownerOf and assetIdOf revert for a token that was never minted or has been burned.
        if (error instanceof BaseError && error.walk((e) => e instanceof ContractFunctionRevertedError)) return null
        throw error
      }
    },
    async getExport(tokenId) {
      const [exporter] = await client.readContract({
        address: exportManager,
        abi: EXPORT_MANAGER_ABI,
        functionName: 'exports',
        args: [tokenId]
      })
      if (exporter === zeroAddress) return null
      // Burning clears assetIdOf, so the asset ID comes from the Burned event.
      const [burned] = await client.getLogs({
        address: assetNFT,
        event: ASSET_NFT_ABI.find((item) => item.type === 'event' && item.name === 'Burned')!,
        args: { tokenId },
        fromBlock: 0n
      })
      return burned ? { exporter, assetId: burned.args.assetId! } : null
    }
  }
}
