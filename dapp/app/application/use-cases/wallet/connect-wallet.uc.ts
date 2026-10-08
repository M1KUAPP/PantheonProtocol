import type { Wallet } from '@core/entities/wallet.entity'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'
import type { IWalletRepository } from '@core/interfaces/wallet.repository.interface'

/**
 * Use case for connecting a Web3 wallet.
 *
 * Initiates the wallet connection flow, prompting the user to
 * connect their wallet (e.g., MetaMask) to the application.
 */
export class ConnectWalletUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}
  async execute(): Promise<Result<Wallet>> {
    return executeAsync(() => this.walletRepository.connect())
  }
}
