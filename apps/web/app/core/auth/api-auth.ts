/**
 * Wallet-signed API requests.
 *
 * The browser signs one EIP-191 message per user action, and sends the signer, the signature and the issue time in
 * request headers. The API rebuilds the message from the request, so a signature only authorizes the action and ids
 * it names.
 * @module
 */

/** Actions a wallet signature can authorize on the API. */
export type ApiAuthAction = 'mint' | 'export'

/** A signed API request: the signing wallet, its signature, and when the message was issued (ISO 8601). */
export interface ApiAuth {
  readonly address: `0x${string}`
  readonly signature: `0x${string}`
  readonly issuedAt: string
}

/** The fields a signed message names. */
export interface ApiAuthMessageFields {
  readonly action: ApiAuthAction
  readonly assetId: number
  readonly tokenId?: number
  readonly issuedAt: string
}

/** Signatures older than this are rejected. */
export const API_AUTH_MAX_AGE_MS = 5 * 60 * 1000

/** Request headers that carry an ApiAuth. */
export const API_AUTH_HEADERS = {
  address: 'x-wallet-address',
  signature: 'x-wallet-signature',
  issuedAt: 'x-wallet-issued-at'
} as const

/** Builds the message the wallet signs. */
export function buildApiAuthMessage({ action, assetId, tokenId, issuedAt }: ApiAuthMessageFields): string {
  return [
    'PantheonProtocol API request',
    `Action: ${action}`,
    `Asset: ${assetId}`,
    ...(tokenId === undefined ? [] : [`Token: ${tokenId}`]),
    `Issued at: ${issuedAt}`
  ].join('\n')
}
