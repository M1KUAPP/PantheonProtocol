/**
 * A discriminated union type representing either a successful result or a failure.
 *
 * This pattern provides type-safe error handling without exceptions,
 * similar to Rust's Result type or functional programming's Either type.
 *
 * @typeParam T - The type of the success value
 * @typeParam E - The type of the error (defaults to Error)
 *
 * @example
 * ```typescript
 * const result: Result<User, ValidationError> = await fetchUser(id);
 * if (isSuccess(result)) {
 *   console.log(result.value.name);
 * } else {
 *   console.error(result.error.message);
 * }
 * ```
 */
export type Result<T, E = Error> = { success: true; value: T } | { success: false; error: E }

/**
 * Creates a successful Result containing a value.
 * @param value - The success value to wrap
 * @returns A successful Result
 */
function success<T>(value: T): Result<T, never> {
  return { success: true, value }
}

/**
 * Creates a failed Result containing an error.
 * @param error - The error to wrap
 * @returns A failed Result
 */
function failure<E>(error: E): Result<never, E> {
  return { success: false, error }
}

/**
 * Type guard to check if a Result is successful.
 * @param result - The Result to check
 * @returns True if the Result is a success, narrowing the type
 */
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; value: T } {
  return result.success === true
}

/**
 * Type guard to check if a Result is a failure.
 * @param result - The Result to check
 * @returns True if the Result is a failure, narrowing the type
 */
export function isFailure<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false
}

/**
 * Extracts the value from a Result, returning a default value on failure.
 * @param result - The Result to unwrap
 * @param defaultValue - The value to return if the Result is a failure
 * @returns The success value or the default value
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (isSuccess(result)) {
    return result.value
  }
  return defaultValue
}

/**
 * Converts a Promise into a Result, catching any thrown errors.
 * @param promise - The Promise to convert
 * @returns A Promise resolving to a Result
 */
export async function fromPromise<T>(promise: Promise<T>): Promise<Result<T, Error>> {
  try {
    const value = await promise
    return success(value)
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)))
  }
}

/**
 * Executes an async operation and wraps the result in a Result type.
 * @param operation - The async function to execute
 * @returns A Promise resolving to a Result
 */
export async function executeAsync<T>(operation: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    const value = await operation()
    return success(value)
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)))
  }
}
