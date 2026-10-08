import type { AssetDataResponse } from '@application/dtos/asset-management.dto'
import { GetAssetDataUseCase } from '@application/use-cases/database/get-asset-data.uc.js'
import { ConfigurationError, NotFoundError, ValidationError } from '@core/errors/domain-error.js'
import { validateUid } from '@presentation/routes/api/validators/uid.validator.js'
import type { ApiDependencies } from '@presentation/routes/api/api-dependencies.js'
import type { Request, Response } from 'express'
import { Router } from 'express'

export function createGetAssetDataRouter({ appConfig, getDatabase }: ApiDependencies): Router {
  const router = Router()
  router.get('/:uid', async (req: Request<{ uid: string }>, res: Response<AssetDataResponse>) => {
    try {
      const { uid } = req.params
      const validation = validateUid(uid)
      if (!validation.valid) {
        return res.status(appConfig.getHttpStatus().BAD_REQUEST).json({
          success: false,
          message: validation.message
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
      const getAssetDataUseCase = new GetAssetDataUseCase(databaseRepository, sourceTable)
      const result = await getAssetDataUseCase.execute(validation.value)
      if (!result.success) {
        if (result.error instanceof NotFoundError) {
          return res.status(appConfig.getHttpStatus().NOT_FOUND).json({
            success: false,
            message: result.error.message,
            code: 'ASSET_NOT_FOUND'
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
      return res.status(appConfig.getHttpStatus().OK).json({
        success: true,
        asset: result.value.asset,
        sourceGame: result.value.sourceGame
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
