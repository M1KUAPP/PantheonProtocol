/**
 * Generic API response wrapper for standardized response handling.
 *
 * @template T - The type of data payload (defaults to void)
 */
export interface ApiResponse<T = void> {
  /** Whether the operation was successful */
  success: boolean
  /** Human-readable message describing the result */
  message?: string
  /** Machine-readable error or status code */
  code?: string
  /** Response payload data */
  data?: T
}
