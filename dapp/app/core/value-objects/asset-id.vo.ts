import { NumericIdValueObject } from '@core/value-objects/base/numeric-id.vo'

/**
 * Value object representing a unique game asset identifier.
 *
 * Asset IDs are used to reference in-game items that can be minted as NFTs.
 * Each asset has a unique numeric identifier in the game's database.
 *
 * @example
 * ```typescript
 * const assetId = AssetId.create(42);
 * console.log(assetId.value); // 42
 * console.log(assetId.toBigInt()); // 42n
 * ```
 */
export class AssetId extends NumericIdValueObject {
  /**
   * Creates a new AssetId instance.
   * @param value - The numeric asset identifier
   */
  private constructor(value: number) {
    super(value)
  }

  /**
   * Factory method to create a validated AssetId instance.
   * @param value - The numeric identifier for the game asset
   * @returns A new AssetId instance
   * @throws Error if the value is not a non-negative integer
   */
  static create(value: number): AssetId {
    if (!AssetId.isValid(value)) {
      throw new Error(`Invalid asset ID: ${value}. Must be a non-negative integer.`)
    }
    return new AssetId(value)
  }

  /**
   * Validates whether a number is a valid asset identifier.
   * @param value - The number to validate
   * @returns True if the value is a non-negative integer
   */
  static isValid(value: number): boolean {
    return NumericIdValueObject.isValidNumericId(value)
  }
}
