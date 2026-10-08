import type { IPriceRepository } from '@core/interfaces/price.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'

/**
 * Use case for fetching the current ETH price in USD.
 *
 * Retrieves the latest ETH/USD exchange rate from the price repository
 * for displaying fiat equivalents of ETH amounts.
 */
export class GetEthPriceUseCase {
  constructor(private readonly priceRepository: IPriceRepository) {}
  async execute(): Promise<Result<number>> {
    return executeAsync(() => this.priceRepository.getEthPriceInUsd())
  }
}
