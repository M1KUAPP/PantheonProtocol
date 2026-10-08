/**
 * Blockchain-related constants used throughout the application.
 * @module blockchain.constants
 */

/**
 * Number of Wei units in one Ether.
 * Wei is the smallest denomination of Ether (1 ETH = 10^18 Wei).
 */
export const WEI_PER_ETHER = 1e18

/**
 * Conversion factor from seconds to milliseconds.
 * Used for converting blockchain timestamps to JavaScript Date objects.
 */
export const SECONDS_TO_MILLISECONDS = 1000

/**
 * ERC-721 error selector for nonexistent token queries.
 * This is the 4-byte function selector for the `ERC721NonexistentToken` error.
 * @see {@link https://eips.ethereum.org/EIPS/eip-721} ERC-721 specification
 */
export const ERC721_NONEXISTENT_TOKEN_ERROR = '0x7e273289'
