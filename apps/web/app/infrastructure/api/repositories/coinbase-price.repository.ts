import { NetworkError } from '@core/errors/domain-error'
import type { IPriceRepository } from '@core/interfaces/price.repository.interface'

/**
 * Response structure from the Coinbase price API.
 */
interface CoinbaseResponse {
  data: {
    /** The base currency (e.g., "ETH") */
    base: string
    /** The quote currency (e.g., "USD") */
    currency: string
    /** The current exchange rate as a string */
    amount: string
  }
}

/**
 * Implementation of IPriceRepository using the Coinbase public API.
 *
 * Fetches real-time cryptocurrency prices from Coinbase's spot price endpoint.
 * This is used to display USD values for NFT listings priced in ETH.
 *
 * @see {@link https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-prices} Coinbase Price API
 */
export class CoinbasePriceRepository implements IPriceRepository {
  /**
   * Fetches the current ETH/USD exchange rate from Coinbase.
   *
   * @returns Promise resolving to the current ETH price in USD
   * @throws NetworkError if the API request fails
   */
  async getEthPriceInUsd(): Promise<number> {
    try {
      const response = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot')
      if (!response.ok) {
        throw new NetworkError(`Failed to fetch price: ${response.statusText}`)
      }
      const json = (await response.json()) as CoinbaseResponse
      return parseFloat(json.data.amount)
    } catch (error) {
      throw new NetworkError('Could not fetch current ETH price')
    }
  }
}
