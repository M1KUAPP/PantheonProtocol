/**
 * Raw attribute structure that may contain boolean values.
 * Represents attributes as they come from external sources.
 */
interface RawAttribute {
  /** The trait/attribute name */
  readonly trait_type: string
  /** The trait value (may be boolean) */
  readonly value: string | number | boolean
}

/**
 * Normalized attribute structure with no boolean values.
 * Used for consistent attribute handling in the domain layer.
 */
interface NormalizedAttribute {
  /** The trait/attribute name */
  readonly trait_type: string
  /** The trait value (boolean converted to string) */
  readonly value: string | number
}

/**
 * Normalizes a single attribute by converting boolean values to strings.
 *
 * @param attr - The raw attribute to normalize
 * @returns The normalized attribute with boolean values as strings
 */
function normalizeAttribute(attr: RawAttribute): NormalizedAttribute {
  return {
    trait_type: attr.trait_type,
    value: typeof attr.value === 'boolean' ? String(attr.value) : attr.value
  }
}

/**
 * Normalizes an array of attributes by converting all boolean values to strings.
 *
 * This ensures consistent attribute handling throughout the application,
 * as some systems (like NFT marketplaces) may not support boolean attribute values.
 *
 * @param attributes - Array of raw attributes to normalize
 * @returns Array of normalized attributes
 *
 * @example
 * ```typescript
 * const raw = [{ trait_type: 'Active', value: true }];
 * const normalized = normalizeAttributes(raw);
 * // Result: [{ trait_type: 'Active', value: 'true' }]
 * ```
 */
export function normalizeAttributes(attributes: RawAttribute[]): NormalizedAttribute[] {
  return attributes.map(normalizeAttribute)
}
