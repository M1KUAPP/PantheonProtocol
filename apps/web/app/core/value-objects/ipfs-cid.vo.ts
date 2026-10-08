import { StringPatternValueObject } from '@core/value-objects/base/string-pattern.vo'

/**
 * Value object representing an IPFS Content Identifier (CID).
 *
 * Supports both CIDv0 (starting with "Qm") and CIDv1 (starting with "b") formats.
 * Used for referencing content stored on the IPFS network, such as NFT metadata and images.
 *
 * @see {@link https://docs.ipfs.io/concepts/content-addressing/} for CID specification
 *
 * @example
 * ```typescript
 * const cid = IpfsCid.create('QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
 * console.log(cid.toGatewayUrl()); // 'https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
 * ```
 */
export class IpfsCid extends StringPatternValueObject {
  /** Regex pattern for CIDv0 format (Base58btc encoded, starts with 'Qm') */
  private static readonly CID_V0_PATTERN = /^Qm[a-zA-Z0-9]{44}$/

  /** Regex pattern for CIDv1 format (Base32 encoded, starts with 'b') */
  private static readonly CID_V1_PATTERN = /^b[a-z2-7]{58,}$/

  /**
   * Creates a new IpfsCid instance.
   * @param value - The validated CID string
   */
  private constructor(value: string) {
    super(value)
  }

  /**
   * Factory method to create a validated IpfsCid instance.
   * @param value - The IPFS CID string to validate and wrap
   * @returns A new IpfsCid instance
   * @throws Error if the CID format is invalid
   */
  static create(value: string): IpfsCid {
    if (!IpfsCid.isValid(value)) {
      throw new Error(`Invalid IPFS CID: ${value}`)
    }
    return new IpfsCid(value)
  }

  /**
   * Validates whether a string is a valid IPFS CID (v0 or v1).
   * @param value - The string to validate
   * @returns True if the string is a valid CIDv0 or CIDv1 format
   */
  static isValid(value: string): boolean {
    return (
      typeof value === 'string' &&
      value.length > 0 &&
      (StringPatternValueObject.isValidPattern(value, IpfsCid.CID_V0_PATTERN) ||
        StringPatternValueObject.isValidPattern(value, IpfsCid.CID_V1_PATTERN))
    )
  }

  /**
   * Converts the CID to a full HTTP gateway URL for browser access.
   * @param gateway - The IPFS gateway base URL (defaults to ipfs.io)
   * @returns The complete gateway URL for accessing the content
   */
  toGatewayUrl(gateway: string = 'https://ipfs.io/ipfs'): string {
    return `${gateway}/${this._value}`
  }
}
