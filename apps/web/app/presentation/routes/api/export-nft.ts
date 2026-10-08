import type { ExportNFTRequest, ExportNFTResponse } from '@application/dtos/asset-management.dto'
import { SyncExportNFTUseCase } from '@application/use-cases/database/sync-exported-nft.uc.js'
import { ConfigurationError, ValidationError } from '@core/errors/domain-error.js'
import type { ApiDependencies } from '@presentation/routes/api/api-dependencies.js'
import { validateTokenId } from '@presentation/routes/api/validators/uid.validator.js'
import { checkWalletSignature } from '@presentation/routes/api/wallet-signature.js'
import type { Request, Response } from 'express'
import { Router } from 'express'
import { isAddressEqual } from 'viem'

function parseExportRequest(
  body: ExportNFTRequest,
  uidParam: string
): { valid: true; data: ExportNFTRequest } | { valid: false; message: string } {
  const { name, description, item_type, rarity, image_path, attributes } = body
  const numericUid = parseInt(uidParam, 10)
  if (isNaN(numericUid) || numericUid < 0) {
    return { valid: false, message: 'UID must be a non-negative number' }
  }
  return {
    valid: true,
    data: {
      uid: numericUid,
      name,
      description,
      item_type,
      rarity,
      image_path,
      attributes
    }
  }
}

/**
 * Adds an exported item to the target game. The request must be signed by the wallet that exported the token.
 */
export function createExportNFTRouter({ appConfig, getDatabase, chain, now = Date.now }: ApiDependencies): Router {
  const router = Router()
  router.post(
    '/:uid',
    async (
      req: Request<{ uid: string }, ExportNFTResponse, ExportNFTRequest & { tokenId?: unknown }>,
      res: Response<ExportNFTResponse>
    ) => {
      try {
        const validation = parseExportRequest(req.body, req.params.uid)
        if (!validation.valid) {
          return res.status(appConfig.getHttpStatus().BAD_REQUEST).json({
            success: false,
            message: validation.message
          })
        }
        const tokenId = validateTokenId(req.body.tokenId)
        if (!tokenId.valid) {
          return res.status(appConfig.getHttpStatus().BAD_REQUEST).json({
            success: false,
            message: tokenId.message
          })
        }
        const assetId = validation.data.uid
        const signature = await checkWalletSignature(
          req,
          { action: 'export', assetId, tokenId: Number(tokenId.value) },
          now()
        )
        if (!signature.ok) {
          return res.status(appConfig.getHttpStatus().UNAUTHORIZED).json({
            success: false,
            message: signature.message
          })
        }
        const exported = await chain.getExport(tokenId.value)
        if (!exported || !isAddressEqual(exported.exporter, signature.signer) || exported.assetId !== BigInt(assetId)) {
          return res.status(appConfig.getHttpStatus().FORBIDDEN).json({
            success: false,
            message: 'Only the wallet that exported this asset can add it to the target game'
          })
        }
        let databaseRepository
        try {
          databaseRepository = getDatabase()
        } catch (error) {
          if (error instanceof ConfigurationError) {
            return res.status(appConfig.getHttpStatus().INTERNAL_SERVER_ERROR).json({
              success: false,
              message: error.message
            })
          }
          throw error
        }
        const targetTable = appConfig.getDatabaseTables().TARGET_TABLE
        if (!targetTable) {
          return res.status(appConfig.getHttpStatus().INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Target table configuration is missing'
          })
        }
        const exportNFTUseCase = new SyncExportNFTUseCase(databaseRepository, targetTable)
        const result = await exportNFTUseCase.execute(validation.data)
        if (!result.success) {
          if (result.error.message.includes('already exists')) {
            return res.status(appConfig.getHttpStatus().CONFLICT).json({
              success: false,
              message: result.error.message,
              code: 'DUPLICATE_ASSET'
            })
          }
          if (result.error instanceof ValidationError) {
            return res.status(appConfig.getHttpStatus().BAD_REQUEST).json({
              success: false,
              message: result.error.message,
              code: 'VALIDATION_ERROR'
            })
          }
          return res.status(appConfig.getHttpStatus().INTERNAL_SERVER_ERROR).json({
            success: false,
            message: result.error.message
          })
        }
        return res.status(appConfig.getHttpStatus().CREATED).json({
          success: true,
          message: result.value.message,
          exportedAsset: result.value.exportedAsset
        })
      } catch (error) {
        const err = error as Error
        return res.status(appConfig.getHttpStatus().INTERNAL_SERVER_ERROR).json({
          success: false,
          message: err.message || 'An internal server error occurred during export completion.'
        })
      }
    }
  )
  return router
}
