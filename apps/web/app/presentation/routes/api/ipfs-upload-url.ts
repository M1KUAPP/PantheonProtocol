import { createAppConfig } from '@config/app-config.js'
import type { Request, Response } from 'express'
import { Router } from 'express'
import { PinataSDK } from 'pinata'

type UploadUrlResponse = { success: boolean; message?: string; url?: string }

const router = Router()
const appConfig = createAppConfig()

/**
 * Creates a short-lived Pinata upload URL so the browser can pin a file without holding the Pinata JWT.
 * @see {@link https://docs.pinata.cloud/files/presigned-urls}
 */
router.post('/', async (_req: Request, res: Response<UploadUrlResponse>) => {
  const pinataJwt = appConfig.getPinataJWT()
  if (!pinataJwt) {
    return res.status(appConfig.getHttpStatus().INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'PINATA_JWT is not configured'
    })
  }
  try {
    const pinata = new PinataSDK({ pinataJwt })
    const url = await pinata.upload.public.createSignedURL({
      expires: 60,
      maxFileSize: 10 * 1024 * 1024,
      mimeTypes: ['image/*', 'application/json']
    })
    return res.status(appConfig.getHttpStatus().OK).json({ success: true, url })
  } catch (error) {
    return res.status(appConfig.getHttpStatus().INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create a Pinata upload URL'
    })
  }
})

export default router
