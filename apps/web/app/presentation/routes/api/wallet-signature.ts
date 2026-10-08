import {
  API_AUTH_HEADERS,
  API_AUTH_MAX_AGE_MS,
  type ApiAuthMessageFields,
  buildApiAuthMessage
} from '@core/auth/api-auth.js'
import { isAddress, isHex, verifyMessage } from 'viem'

/** How far in the future an issue time may be, to allow for clock drift between browser and server. */
const MAX_CLOCK_SKEW_MS = 60 * 1000

type WalletSignatureCheck = { ok: true; signer: `0x${string}` } | { ok: false; message: string }

/**
 * Checks the request's EIP-191 wallet signature over the message for `fields`.
 * @returns The signing wallet, or why the signature was rejected.
 */
export async function checkWalletSignature(
  req: { header(name: string): string | undefined },
  fields: Omit<ApiAuthMessageFields, 'issuedAt'>,
  now: number
): Promise<WalletSignatureCheck> {
  const address = req.header(API_AUTH_HEADERS.address)
  const signature = req.header(API_AUTH_HEADERS.signature)
  const issuedAt = req.header(API_AUTH_HEADERS.issuedAt)
  if (!address || !signature || !issuedAt) {
    return { ok: false, message: 'This request needs a wallet signature' }
  }
  const issued = Date.parse(issuedAt)
  if (Number.isNaN(issued) || now - issued > API_AUTH_MAX_AGE_MS || issued - now > MAX_CLOCK_SKEW_MS) {
    return { ok: false, message: 'The wallet signature has expired; sign the request again' }
  }
  if (!isAddress(address) || !isHex(signature)) {
    return { ok: false, message: 'The wallet signature is malformed' }
  }
  const message = buildApiAuthMessage({ ...fields, issuedAt })
  const valid = await verifyMessage({ address, message, signature }).catch(() => false)
  return valid ? { ok: true, signer: address } : { ok: false, message: 'The wallet signature is invalid' }
}
