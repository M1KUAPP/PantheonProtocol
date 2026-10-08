/**
 * Server-side dependency injection container factory.
 *
 * Creates the DI container for Node.js server environment,
 * specifically for database operations via Supabase.
 * @module
 */

import { createAppConfig } from '@config/app-config'
import { ConfigurationError } from '@core/errors/domain-error'
import type { IDatabaseRepository } from '@core/interfaces/database.repository.interface'
import { ServerDatabaseRepository } from '@infrastructure/database/repositories/server-database.repository'
import { ServerDatabaseService } from '@infrastructure/database/server-database.service'

/** Container holding server-side database dependencies. */
export interface ServerDatabaseContainer {
  readonly databaseRepository: IDatabaseRepository
}

/** Configuration for server database connection. */
interface ServerDatabaseConfig {
  readonly supabaseUrl: string
  readonly supabaseKey: string
}

/**
 * Creates a server database container with configured repository.
 * @param config - Supabase connection configuration.
 * @returns Container with initialized database repository.
 * @throws ConfigurationError if required configuration is missing.
 */
function createServerDatabaseContainer(config: ServerDatabaseConfig): ServerDatabaseContainer {
  const { supabaseUrl, supabaseKey } = config
  if (!supabaseUrl) {
    throw new ConfigurationError('Supabase URL is required for server database container')
  }
  if (!supabaseKey) {
    throw new ConfigurationError('Supabase key is required for server database container')
  }
  const databaseService = new ServerDatabaseService(supabaseUrl, supabaseKey)
  const databaseRepository = new ServerDatabaseRepository(databaseService)
  return {
    databaseRepository
  }
}

/**
 * Creates a server database container using environment configuration.
 * Reads Supabase credentials from AppConfig.
 * @returns Container with initialized database repository.
 * @throws ConfigurationError if database configuration is missing.
 */
export function createServerDatabaseContainerFromConfig(): ServerDatabaseContainer {
  const appConfig = createAppConfig()
  const supabaseUrl = appConfig.getSupabaseUrl()
  const supabaseKey = appConfig.getSupabaseServiceRoleKey()
  if (!supabaseUrl || !supabaseKey) {
    throw new ConfigurationError('Database configuration is missing')
  }
  return createServerDatabaseContainer({
    supabaseUrl,
    supabaseKey
  })
}
