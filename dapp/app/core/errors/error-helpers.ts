/**
 * Determines if an error was caused by the user rejecting a transaction.
 *
 * Checks for EIP-1193 error code 4001, which indicates user rejection.
 * Recursively checks the error's cause chain to handle wrapped errors.
 *
 * @param error - The error to check
 * @returns True if the error represents a user rejection
 *
 * @see {@link https://eips.ethereum.org/EIPS/eip-1193#provider-errors} EIP-1193 Provider Errors
 *
 * @example
 * ```typescript
 * try {
 *   await sendTransaction();
 * } catch (error) {
 *   if (isUserRejectedError(error)) {
 *     console.log('User cancelled the transaction');
 *   } else {
 *     throw error;
 *   }
 * }
 * ```
 */
export function isUserRejectedError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const errorObj = error as any
  if (errorObj.code === 4001) {
    return true
  }
  if (errorObj.cause) {
    return isUserRejectedError(errorObj.cause)
  }
  return false
}
