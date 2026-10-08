import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'
import type { IWalletRepository } from '@core/interfaces/wallet.repository.interface'

/**
 * Use case for disconnecting the current Web3 wallet.
 *
 * Terminates the active wallet session, clearing connection state
 * and requiring the user to reconnect for future blockchain operations.
 */
export class DisconnectWalletUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}
  async execute(): Promise<Result<void>> {
    return executeAsync(async () => {
      await this.walletRepository.disconnect()
      return undefined
    })
  }
}
