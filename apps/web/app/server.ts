/**
 * Express server entry point for the backend API.
 *
 * Configures and starts the Express server with CORS, JSON parsing,
 * health check endpoint, and API routes for asset management.
 * @module
 */

import { createAppConfig } from '@config/app-config.js'
import { ConfigurationError } from '@core/errors/domain-error'
import exportRoutes from '@presentation/routes/api/export-nft.js'
import getDataRoutes from '@presentation/routes/api/get-asset-data.js'
import ipfsUploadUrlRoutes from '@presentation/routes/api/ipfs-upload-url.js'
import removeDataRoutes from '@presentation/routes/api/remove-asset-data.js'
import cors from 'cors'
import type { NextFunction, Request, Response } from 'express'
import express from 'express'

/** Application configuration instance. */
const appConfig = createAppConfig()
/** Server port from configuration. */
const PORT = appConfig.getPort()
/** API endpoint paths from configuration. */
const apiEndpoints = appConfig.getApiEndpoints()

/** CORS configuration allowing frontend origin. */
const corsOptions = {
  origin: appConfig.getFrontendUrl() || '*',
  optionsSuccessStatus: 200
}

/** Express application instance. */
const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/** Health check endpoint for monitoring server and database status. */
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const supabaseUrl = appConfig.getSupabaseUrl()
    const supabaseKey = appConfig.getSupabaseServiceRoleKey()
    const isDbConnected = !!(supabaseUrl && supabaseKey)
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: isDbConnected ? 'connected' : 'disconnected'
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/** Mount API routes for asset operations. */
app.use(apiEndpoints.GET_RECORD, getDataRoutes)
app.use(apiEndpoints.EXPORT_RECORD, exportRoutes)
app.use(apiEndpoints.REMOVE_RECORD, removeDataRoutes)
app.use(apiEndpoints.IPFS_UPLOAD_URL, ipfsUploadUrlRoutes)

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

/**
 * Initializes and starts the Express server.
 * Validates database configuration before starting.
 * @throws ConfigurationError if database is not properly configured.
 */
async function startServer() {
  try {
    const supabaseUrl = appConfig.getSupabaseUrl()
    const supabaseKey = appConfig.getSupabaseServiceRoleKey()
    if (!supabaseUrl || !supabaseKey) {
      throw new ConfigurationError('Database service is not properly configured')
    }
    app.listen(PORT)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

/** Graceful shutdown handler for SIGTERM. */
process.on('SIGTERM', () => {
  process.exit(0)
})

/** Graceful shutdown handler for SIGINT (Ctrl+C). */
process.on('SIGINT', () => {
  process.exit(0)
})

startServer()
