/**
 * Database seeding script entry point.
 *
 * Orchestrates the complete database seeding process including
 * image uploads to Supabase Storage and game asset record creation.
 * @module
 */

import { PrismaClient } from '@prisma/client'
import path from 'path'
import { fileURLToPath } from 'url'
import { sourceGameAssetsData, targetGameAssetsData } from './seed-data.js'
import { Seeder } from './seeder.js'
import { SupabaseStorage } from './supabase-storage.js'

/** Current file path for ESM module resolution. */
const __filename = fileURLToPath(import.meta.url)
/** Current directory path for resolving relative paths. */
const __dirname = path.dirname(__filename)
/** Local folder containing game asset images to upload. */
const LOCAL_IMAGE_FOLDER = path.join(__dirname, '..', 'assets', 'game_asset_images')

/** Supabase storage bucket name from environment. */
const SUPABASE_BUCKET = process.env.VITE_SUPABASE_BUCKET_NAME
/** Supabase project URL from environment. */
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
/** Supabase service role key from environment. */
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase configuration')
}

/**
 * Main seeding function that orchestrates the database initialization.
 * Resets database, uploads images, and creates game asset records.
 * @throws Error if Supabase configuration is missing or seeding fails.
 */
async function seeding() {
  console.log('Starting seed script...')
  const prisma = new PrismaClient()
  const seeder = new Seeder(prisma)
  if (!SUPABASE_URL || !SUPABASE_KEY || !SUPABASE_BUCKET) {
    throw new Error('Missing required Supabase configuration')
  }
  const storage = new SupabaseStorage(SUPABASE_URL, SUPABASE_KEY, SUPABASE_BUCKET)
  try {
    await seeder.resetDatabase()
    console.log('Database reset complete')
    await storage.getOrCreateBucket(SUPABASE_BUCKET)
    console.log('Storage bucket ready')
    const allImages = [...sourceGameAssetsData, ...targetGameAssetsData].map((a) => a.localImageName)
    const uniqueImages = [...new Set(allImages)]
    console.log(`Found ${uniqueImages.length} unique images`)
    const imageUrlMap = new Map<string, string>()
    for (const imageName of uniqueImages) {
      const imagePath = path.join(LOCAL_IMAGE_FOLDER, imageName)
      const imageUrl = await storage.uploadImage(imageName, imagePath)
      if (imageUrl) {
        imageUrlMap.set(imageName, imageUrl)
        console.log(`Uploaded: ${imageName}`)
      }
    }
    console.log(`\nProcessing source game assets (${sourceGameAssetsData.length})`)
    for (const asset of sourceGameAssetsData) {
      const imageUrl = imageUrlMap.get(asset.localImageName)
      if (!imageUrl) {
        console.warn(`!!! Skipping ${asset.uid}: Missing image`)
        continue
      }
      try {
        await seeder.createSourceGameAsset(asset, imageUrl)
        console.log(`Created source game asset: ${asset.uid}`)
      } catch (error: any) {
        console.error(`!!! Failed to create source game asset ${asset.uid}:`, error.message)
      }
    }
    console.log(`\nProcessing target game assets (${targetGameAssetsData.length})`)
    for (const asset of targetGameAssetsData) {
      const imageUrl = imageUrlMap.get(asset.localImageName)
      if (!imageUrl) {
        console.warn(`!!! Skipping ${asset.uid}: Missing image`)
        continue
      }
      try {
        await seeder.createTargetGameAsset(asset, imageUrl)
        console.log(`Created target game asset: ${asset.uid}`)
      } catch (error: any) {
        console.error(`!!! Failed to create target game asset ${asset.uid}:`, error.message)
      }
    }
    console.log('\nSeeding completed successfully')
  } catch (error: any) {
    console.error('!!! Fatal error:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
    console.log('Disconnected from database')
  }
}

seeding().catch((error) => {
  console.error(error)
  process.exit(1)
})
