import { WEI_PER_ETHER } from '@core/constants/blockchain.constants'
import { ValueObject } from '@core/value-objects/base/value-object.base'

/**
 * Value object representing an amount in Wei (the smallest unit of Ether).
 *
 * 1 Ether = 10^18 Wei. This class provides type-safe handling of cryptocurrency
 * amounts with conversion utilities between Wei and Ether representations.
 *
 * @example
 * ```typescript
 * const price = WeiAmount.create(1000000000000000000n); // 1 ETH in Wei
 * console.log(price.toEther()); // 1
 * console.log(price.toEtherString(2)); // '1.00'
 *
 * const fromStr = WeiAmount.fromString('500000000000000000');
 * console.log(fromStr.toEther()); // 0.5
 * ```
 */
export class WeiAmount extends ValueObject<bigint> {
  /**
   * Creates a new WeiAmount instance.
   * @param value - The amount in Wei as a BigInt
   */
  private constructor(value: bigint) {
    super(value)
  }

  /**
   * Factory method to create a validated WeiAmount instance.
   * @param value - The Wei amount as a BigInt
   * @returns A new WeiAmount instance
   * @throws Error if the value is negative
   */
  static create(value: bigint): WeiAmount {
    if (!WeiAmount.isValid(value)) {
      throw new Error(`Invalid Wei amount: ${value}. Must be non-negative.`)
    }
    return new WeiAmount(value)
  }

  /**
   * Creates a WeiAmount from a string representation.
   * Useful for parsing values from smart contract responses or user input.
   * @param value - The Wei amount as a string
   * @returns A new WeiAmount instance
   * @throws Error if the string cannot be parsed as a valid BigInt
   */
  static fromString(value: string): WeiAmount {
    try {
      const bigIntValue = BigInt(value)
      return WeiAmount.create(bigIntValue)
    } catch (error) {
      throw new Error(`Cannot parse Wei amount from string: ${value}`, { cause: error })
    }
  }

  /**
   * Validates whether a BigInt is a valid Wei amount.
   * @param value - The BigInt to validate
   * @returns True if the value is non-negative
   */
  static isValid(value: bigint): boolean {
    return value >= 0n
  }

  /**
   * Converts the Wei amount to Ether as a floating-point number.
   * Note: May lose precision for very large values.
   * @returns The amount in Ether
   */
  toEther(): number {
    return Number(this._value) / WEI_PER_ETHER
  }

  /**
   * Converts the Wei amount to a formatted Ether string.
   * @param decimals - Number of decimal places (defaults to 4)
   * @returns The formatted Ether amount as a string
   */
  toEtherString(decimals: number = 4): string {
    return this.toEther().toFixed(decimals)
  }

  /**
   * Compares this amount with another for equality.
   * @param other - The WeiAmount to compare against
   * @returns True if the amounts are equal
   */
  equals(other: WeiAmount): boolean {
    return this._value === other._value
  }

  /**
   * Checks if this amount is greater than another.
   * @param other - The WeiAmount to compare against
   * @returns True if this amount is greater
   */
  isGreaterThan(other: WeiAmount): boolean {
    return this._value > other._value
  }
}
