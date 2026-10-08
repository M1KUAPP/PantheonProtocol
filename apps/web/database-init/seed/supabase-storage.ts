/**
 * Supabase storage service for image uploads.
 *
 * Handles bucket management and file uploads to Supabase Storage
 * for game asset images during database seeding.
 * @module
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'

/**
 * Supabase Storage client for managing image uploads.
 * Creates buckets and uploads game asset images with public access.
 */
export class SupabaseStorage {
  private supabase: SupabaseClient
  private bucketName: string
  constructor(supabaseUrl: string, supabaseKey: string, bucketName: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
    this.bucketName = bucketName
  }

  /**
   * Ensures a storage bucket exists, creating it if necessary.
   * @param bucketName - Name of the bucket to get or create.
   * @throws Error if bucket creation fails.
   */
  async getOrCreateBucket(bucketName: string): Promise<void> {
    const { error } = await this.supabase.storage.getBucket(bucketName)
    if (error && error.message.includes('Bucket not found')) {
      const { error: createError } = await this.supabase.storage.createBucket(bucketName, {
        public: true
      })
      if (createError) throw createError
    } else if (error) {
      throw error
    }
  }

  /**
   * Uploads an image file to the storage bucket.
   * @param fileName - Name to use for the uploaded file.
   * @param filePath - Local filesystem path to the image file.
   * @returns Public URL of the uploaded image, or null if upload fails.
   */
  async uploadImage(fileName: string, filePath: string): Promise<string | null> {
    try {
      const fileBuffer = await readFile(filePath)
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true })
      if (uploadError) throw uploadError
      const { data: urlData } = this.supabase.storage.from(this.bucketName).getPublicUrl(uploadData.path)
      return urlData.publicUrl
    } catch (error) {
      console.error(`Error uploading ${fileName}:`, error instanceof Error ? error.message : error)
      return null
    }
  }
}
