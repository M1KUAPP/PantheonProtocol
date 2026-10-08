import type { DeleteAssetResponse } from '@application/dtos/asset-management.dto'
import { RemoveAssetDataUseCase } from '@application/use-cases/database/remove-asset-data.uc.js'
import { ConfigurationError, NotFoundError, ValidationError } from '@core/errors/domain-error.js'
import { validateTokenId, validateUid } from '@presentation/routes/api/validators/uid.validator.js'
import { checkWalletSignature } from '@presentation/routes/api/wallet-signature.js'
import type { ApiDependencies } from '@presentation/routes/api/api-dependencies.js'
import type { Request, Response } from 'express'
import { Router } from 'express'
import { isAddressEqual } from 'viem'

/**
 * Removes a minted item from the source game. The request must be signed by the wallet holding the token minted from it.
 */
export function createRemoveAssetDataRouter({
  appConfig,
  getDatabase,
  chain,
  now = Date.now
}: ApiDependencies): Router {
  const router = Router()
  router.delete('/:uid', async (req: Request<{ uid: string }>, res: Response<DeleteAssetResponse>) => {
    try {
      const { uid } = req.params
      const validation = validateUid(uid)
      if (!validation.valid) {
        return res.status(appConfig.getHttpStatus().BAD_REQUEST).json({
          success: false,
          message: validation.message
        })
      }
      const tokenId = validateTokenId(req.query.tokenId)
      if (!tokenId.valid) {
        return res.status(appConfig.getHttpStatus().BAD_REQUEST).json({
          success: false,
          message: tokenId.message
        })
      }
      const signature = await checkWalletSignature(req, { action: 'mint', assetId: validation.value }, now())
      if (!signature.ok) {
        return res.status(appConfig.getHttpStatus().UNAUTHORIZED).json({
          success: false,
          message: signature.message
        })
      }
      const token = await chain.getToken(tokenId.value)
      if (!token || !isAddressEqual(token.owner, signature.signer) || token.assetId !== BigInt(validation.value)) {
        return res.status(appConfig.getHttpStatus().FORBIDDEN).json({
          success: false,
          message: 'Only the wallet holding the token minted from this asset can remove it'
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
      const sourceTable = appConfig.getDatabaseTables().SOURCE_TABLE
      if (!sourceTable) {
        return res.status(appConfig.getHttpStatus().INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Source table configuration is missing'
        })
      }
      const removeAssetDataUseCase = new RemoveAssetDataUseCase(databaseRepository, sourceTable)
      const result = await removeAssetDataUseCase.execute(validation.value)
      if (!result.success) {
        if (result.error instanceof NotFoundError) {
          return res.status(appConfig.getHttpStatus().NOT_FOUND).json({
            success: false,
            message: result.error.message
          })
        }
        if (result.error instanceof ValidationError) {
          return res.status(appConfig.getHttpStatus().BAD_REQUEST).json({
            success: false,
            message: result.error.message
          })
        }
        return res.status(appConfig.getHttpStatus().INTERNAL_SERVER_ERROR).json({
          success: false,
          message: result.error.message
        })
      }
      return res.status(appConfig.getHttpStatus().OK).json({
        success: true,
        message: result.value.message
      })
    } catch (error) {
      const err = error as Error
      return res.status(appConfig.getHttpStatus().INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || 'An internal server error occurred'
      })
    }
  })
  return router
}
