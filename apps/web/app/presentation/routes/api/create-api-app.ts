import type { ApiDependencies } from '@presentation/routes/api/api-dependencies.js'
import { createExportNFTRouter } from '@presentation/routes/api/export-nft.js'
import { createGetAssetDataRouter } from '@presentation/routes/api/get-asset-data.js'
import { createIpfsUploadUrlRouter } from '@presentation/routes/api/ipfs-upload-url.js'
import { createRemoveAssetDataRouter } from '@presentation/routes/api/remove-asset-data.js'
import cors from 'cors'
import type { Express, NextFunction, Request, Response } from 'express'
import express from 'express'

/**
 * Builds the Express API: CORS, JSON parsing, the health check and the asset and IPFS routes.
 */
export function createApiApp(deps: ApiDependencies): Express {
  const { appConfig } = deps
  const apiEndpoints = appConfig.getApiEndpoints()
  const app = express()

  app.use(cors({ origin: appConfig.getFrontendUrl() || '*', optionsSuccessStatus: 200 }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  /** Health check endpoint for monitoring server and database status. */
  app.get('/api/health', (_req: Request, res: Response) => {
    const isDbConnected = !!(appConfig.getSupabaseUrl() && appConfig.getSupabaseServiceRoleKey())
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: isDbConnected ? 'connected' : 'disconnected'
    })
  })

  app.use(apiEndpoints.GET_RECORD, createGetAssetDataRouter(deps))
  app.use(apiEndpoints.EXPORT_RECORD, createExportNFTRouter(deps))
  app.use(apiEndpoints.REMOVE_RECORD, createRemoveAssetDataRouter(deps))
  app.use(apiEndpoints.IPFS_UPLOAD_URL, createIpfsUploadUrlRouter(deps))

  /** 404 handler for unmatched routes. */
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.path} not found`
    })
  })

  /** Global error handler for uncaught exceptions. */
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
      success: false,
      message: err.message
    })
  })

  return app
}
