import type { ExportNFTRequest, ExportNFTResponse } from '@application/dtos/asset-management.dto'
import { SyncExportNFTUseCase } from '@application/use-cases/database/sync-exported-nft.uc.js'
import { createAppConfig } from '@config/app-config.js'
import { ConfigurationError, ValidationError } from '@core/errors/domain-error.js'
import { createServerDatabaseContainerFromConfig } from '@shared/di/server-container-factory.js'
import type { Request, Response } from 'express'
import { Router } from 'express'

const router = Router()
const appConfig = createAppConfig()

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

router.post(
  '/:uid',
  async (req: Request<{ uid: string }, ExportNFTResponse, ExportNFTRequest>, res: Response<ExportNFTResponse>) => {
    try {
      const validation = parseExportRequest(req.body, req.params.uid)
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
      const targetTable = appConfig.getDatabaseTables().TARGET_TABLE
      if (!targetTable) {
        return res.status(appConfig.getHttpStatus().INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Target table configuration is missing'
        })
      }
      const exportNFTUseCase = new SyncExportNFTUseCase(container.databaseRepository, targetTable)
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

export default router
