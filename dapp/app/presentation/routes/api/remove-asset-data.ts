import type { DeleteAssetResponse } from '@application/dtos/asset-management.dto'
import { RemoveAssetDataUseCase } from '@application/use-cases/database/remove-asset-data.uc.js'
import { createAppConfig } from '@config/app-config.js'
import { ConfigurationError, NotFoundError, ValidationError } from '@core/errors/domain-error.js'
import { validateUid } from '@presentation/routes/api/validators/uid.validator.js'
import { createServerDatabaseContainerFromConfig } from '@shared/di/server-container-factory.js'
import type { Request, Response } from 'express'
import { Router } from 'express'

const router = Router()
const appConfig = createAppConfig()

router.delete('/:uid', async (req: Request, res: Response<DeleteAssetResponse>) => {
  try {
    const { uid } = req.params
    const validation = validateUid(uid)
    if (!validation.valid) {
      return res.status(appConfig.getHttpStatus().BAD_REQUEST).json({
        success: false,
        message: validation.message
      })
    }
    let container
    try {
      container = createServerDatabaseContainerFromConfig()
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
    const removeAssetDataUseCase = new RemoveAssetDataUseCase(container.databaseRepository, sourceTable)
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

export default router
