import { ContractError } from '@core/errors/domain-error'
import type { Abi, Log } from 'viem'
import { decodeEventLog, parseEventLogs } from 'viem'

/**
 * Extracts the minted token ID from NFT mint transaction logs.
 *
 * Parses through transaction logs to find the 'Minted' event and
 * extracts the newly created token ID.
 *
 * @param logs - Array of transaction logs from the mint transaction
 * @param abi - The contract ABI for decoding events
 * @returns The minted token ID as a number
 * @throws ContractError if the Minted event is not found in logs
 */
export function extractMintedTokenId(logs: Log[], abi: Abi): number {
  const parseErrors: string[] = []
  for (const log of logs) {
    try {
      const decoded = decodeEventLog({
        abi,
        data: log.data,
        topics: log.topics
      })
      if (decoded.eventName === 'Minted' && decoded.args) {
        const args = decoded.args as unknown as { tokenId: bigint }
        if (args.tokenId !== undefined) {
          return Number(args.tokenId)
        }
      }
    } catch (error) {
      parseErrors.push(error instanceof Error ? error.message : String(error))
    }
  }
  const errorContext = parseErrors.length > 0 ? ` Parse errors: ${parseErrors.join('; ')}` : ''
  throw new ContractError(`Failed to extract minted token ID from transaction logs.${errorContext}`)
}

/**
 * Extracts the listing ID from marketplace list transaction logs.
 *
 * Parses through transaction logs to find the 'Listed' event and
 * extracts the created listing ID.
 *
 * @param logs - Array of transaction logs from the list transaction
 * @param abi - The marketplace contract ABI for decoding events
 * @returns The listing ID as a bigint, or null if not found
 */
export function extractListingId(logs: Log[], abi: Abi): bigint | null {
  const parsedLogs = parseEventLogs({
    abi,
    logs,
    eventName: 'Listed'
  })
  if (parsedLogs.length === 0) {
    return null
  }
  const args = parsedLogs[0].args as { listingId?: bigint }
  return args.listingId ?? null
}
