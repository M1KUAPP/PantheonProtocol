import { type ApiAuth, type ApiAuthMessageFields, buildApiAuthMessage } from '@core/auth/api-auth'
import { WalletError } from '@core/errors/domain-error'
import type { IWalletRepository } from '@core/interfaces/wallet.repository.interface'

/**
 * Asks the connected wallet to sign one API request, for the action and ids in `fields`.
 * @throws UserRejectedError if the user declines to sign
 */
export async function signApiRequest(
  walletRepository: IWalletRepository,
  fields: Omit<ApiAuthMessageFields, 'issuedAt'>
): Promise<ApiAuth> {
  const address = await walletRepository.getAddress()
  if (!address) {
    throw new WalletError('Connect a wallet to sign the request')
  }
  const issuedAt = new Date().toISOString()
  const signature = await walletRepository.signMessage(buildApiAuthMessage({ ...fields, issuedAt }))
  return { address: address.value as `0x${string}`, signature, issuedAt }
}
