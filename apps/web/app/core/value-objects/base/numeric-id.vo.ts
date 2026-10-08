import { ValueObject } from '@core/value-objects/base/value-object.base'

/**
 * Abstract base class for numeric identifier value objects.
 *
 * Provides a foundation for creating type-safe numeric identifiers such as
 * token IDs, listing IDs, or asset IDs. Ensures values are non-negative integers.
 *
 * @example
 * ```typescript
 * class OrderId extends NumericIdValueObject {
 *   static create(value: number): OrderId {
 *     if (!this.isValidNumericId(value)) {
 *       throw new Error('Invalid order ID');
 *     }
 *     return new OrderId(value);
 *   }
 * }
 * ```
 */
export abstract class NumericIdValueObject extends ValueObject<number> {
  /**
   * Creates a new NumericIdValueObject instance.
   * @param value - The numeric identifier value
   */
  protected constructor(value: number) {
    super(value)
  }

  /**
   * Validates that a number is a valid numeric identifier.
   * @param value - The number to validate
   * @returns True if the value is a non-negative integer
   */
  protected static isValidNumericId(value: number): boolean {
    return Number.isInteger(value) && value >= 0
  }

  /**
   * Compares this identifier with another for equality.
   * @param other - The identifier to compare against
   * @returns True if the numeric values are equal
   */
  equals(other: NumericIdValueObject): boolean {
    return this._value === other._value
  }

  /**
   * Converts the numeric identifier to a BigInt.
   * Useful for blockchain operations that require BigInt types.
   * @returns The identifier as a BigInt
   */
  toBigInt(): bigint {
    return BigInt(this._value)
  }
}
