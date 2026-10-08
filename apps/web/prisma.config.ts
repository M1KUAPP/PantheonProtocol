import { defineConfig } from 'prisma/config'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set in the .env file')
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL
  },
  migrations: {
    seed: 'tsx database-init/seed/seed.ts'
  },
  schema: 'database-init/schema/schema.prisma'
})
