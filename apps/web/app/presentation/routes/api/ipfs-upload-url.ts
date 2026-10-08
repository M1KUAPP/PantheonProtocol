import type { ApiDependencies } from '@presentation/routes/api/api-dependencies.js'
import { validateUid } from '@presentation/routes/api/validators/uid.validator.js'
import { checkWalletSignature } from '@presentation/routes/api/wallet-signature.js'
import type { Request, Response } from 'express'
import { Router } from 'express'

type UploadUrlResponse = { success: boolean; message?: string; url?: string }

/**
 * Hands the browser a short-lived Pinata upload URL so it can pin a file without holding the Pinata JWT.
 * The request must carry a mint signature for an item that is still in the source game.
 * @see {@link https://docs.pinata.cloud/files/presigned-urls}
 */
export function createIpfsUploadUrlRouter({
  appConfig,
  getDatabase,
  createUploadUrl,
  now = Date.now
}: ApiDependencies): Router {
  const router = Router()
  const status = appConfig.getHttpStatus()
  router.post(
    '/',
    async (req: Request<object, UploadUrlResponse, { assetId?: unknown }>, res: Response<UploadUrlResponse>) => {
      try {
        const validation = validateUid(String(req.body?.assetId ?? ''))
        if (!validation.valid) {
          return res.status(status.BAD_REQUEST).json({ success: false, message: validation.message })
        }
        const signature = await checkWalletSignature(req, { action: 'mint', assetId: validation.value }, now())
        if (!signature.ok) {
          return res.status(status.UNAUTHORIZED).json({ success: false, message: signature.message })
        }
        const sourceTable = appConfig.getDatabaseTables().SOURCE_TABLE
        if (!sourceTable) {
          return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: 'Source table configuration is missing' })
        }
        const asset = await getDatabase().getAssetByUid(sourceTable, validation.value)
        if (asset.error) {
          throw new Error(asset.error)
        }
        if (!asset.data) {
          return res
            .status(status.NOT_FOUND)
            .json({ success: false, message: `Asset with UID ${validation.value} is not in the source game` })
        }
        const url = await createUploadUrl()
        return res.status(status.OK).json({ success: true, url })
      } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to create a Pinata upload URL'
        })
      }
    }
  )
  return router
}
