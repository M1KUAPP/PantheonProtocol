/**
 * Repository interface for cryptocurrency price data.
 *
 * Provides methods for fetching current market prices
 * to enable USD value calculations for NFT listings.
 */
export interface IPriceRepository {
  /**
   * Gets the current Ethereum price in US Dollars.
   * @returns Promise resolving to the ETH/USD exchange rate
   */
  getEthPriceInUsd(): Promise<number>
}
