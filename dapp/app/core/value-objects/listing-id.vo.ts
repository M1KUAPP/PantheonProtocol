import { NumericIdValueObject } from '@core/value-objects/base/numeric-id.vo'

/**
 * Value object representing a unique marketplace listing identifier.
 *
 * Listing IDs are assigned by the marketplace smart contract when an NFT
 * is listed for sale. Used to track and reference specific marketplace listings.
 *
 * @example
 * ```typescript
 * const listingId = ListingId.create(123);
 * console.log(listingId.value); // 123
 * ```
 */
export class ListingId extends NumericIdValueObject {
  /**
   * Creates a new ListingId instance.
   * @param value - The numeric listing identifier
   */
  private constructor(value: number) {
    super(value)
  }

  /**
   * Factory method to create a validated ListingId instance.
   * @param value - The numeric identifier for the marketplace listing
   * @returns A new ListingId instance
   * @throws Error if the value is not a non-negative integer
   */
  static create(value: number): ListingId {
    if (!ListingId.isValid(value)) {
      throw new Error(`Invalid listing ID: ${value}. Must be a non-negative integer.`)
    }
    return new ListingId(value)
  }

  /**
   * Validates whether a number is a valid listing identifier.
   * @param value - The number to validate
   * @returns True if the value is a non-negative integer
   */
  static isValid(value: number): boolean {
    return NumericIdValueObject.isValidNumericId(value)
  }
}
