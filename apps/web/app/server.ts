/**
 * Express server entry point for the backend API.
 *
 * Wires the API to Supabase, Pinata, the chain and the app config, then starts listening.
 * @module
 */

import { createAppConfig } from '@config/app-config.js'
import { ConfigurationError } from '@core/errors/domain-error'
import { createAssetChainReader } from '@infrastructure/blockchain/repositories/asset-chain-reader.js'
import { createApiApp } from '@presentation/routes/api/create-api-app.js'
import { createServerDatabaseContainerFromConfig } from '@shared/di/server-container-factory.js'
import { PinataSDK } from 'pinata'

/** Application configuration instance. */
const appConfig = createAppConfig()

const app = createApiApp({
  appConfig,
  getDatabase: () => createServerDatabaseContainerFromConfig().databaseRepository,
  chain: createAssetChainReader(appConfig),
  createUploadUrl: async () => {
    const pinataJwt = appConfig.getPinataJWT()
    if (!pinataJwt) {
      throw new ConfigurationError('PINATA_JWT is not configured')
    }
    return new PinataSDK({ pinataJwt }).upload.public.createSignedURL({
      expires: 60,
      maxFileSize: 10 * 1024 * 1024,
      mimeTypes: ['image/*', 'application/json']
    })
  }
})

/**
 * Starts the server once the database configuration is present.
 * @throws ConfigurationError if database is not properly configured.
 */
function startServer() {
  try {
    if (!appConfig.getSupabaseUrl() || !appConfig.getSupabaseServiceRoleKey()) {
      throw new ConfigurationError('Database service is not properly configured')
    }
    app.listen(appConfig.getPort())
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
