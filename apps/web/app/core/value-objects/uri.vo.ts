import { StringPatternValueObject } from '@core/value-objects/base/string-pattern.vo'

/**
 * Value object representing a Uniform Resource Identifier (URI).
 *
 * Validates that the string follows the URI scheme format (scheme://...).
 * Commonly used for NFT tokenURIs which may be HTTP URLs or IPFS URIs.
 * Provides utility methods for converting IPFS URIs to gateway URLs.
 *
 * @example
 * ```typescript
 * const httpUri = Uri.create('https://example.com/metadata.json');
 * const ipfsUri = Uri.create('ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
 *
 * console.log(ipfsUri.toGatewayUrl());
 * // 'https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
 * ```
 */
export class Uri extends StringPatternValueObject {
  /** Regex pattern validating URI scheme format (must start with scheme:) */
  private static readonly PATTERN = /^[a-zA-Z][a-zA-Z0-9+.-]*:/

  /**
   * Creates a new Uri instance.
   * @param value - The validated URI string
   */
  private constructor(value: string) {
    super(value)
  }

  /**
   * Factory method to create a validated Uri instance.
   * @param value - The URI string to validate and wrap
   * @returns A new Uri instance
   * @throws Error if the URI format is invalid
   */
  static create(value: string): Uri {
    if (!Uri.isValid(value)) {
      throw new Error(`Invalid URI: ${value}`)
    }
    return new Uri(value)
  }

  /**
   * Validates whether a string is a valid URI format.
   * @param value - The string to validate
   * @returns True if the string matches the URI scheme format
   */
  static isValid(value: string): boolean {
    return typeof value === 'string' && value.length > 0 && StringPatternValueObject.isValidPattern(value, Uri.PATTERN)
  }

  /**
   * Checks if this URI uses the IPFS protocol.
   * @returns True if the URI starts with 'ipfs://'
   */
  private isIpfs(): boolean {
    return this._value.startsWith('ipfs://')
  }

  /**
   * Converts the URI to an HTTP gateway URL for browser access.
   * IPFS URIs are converted to use the specified gateway.
   * Non-IPFS URIs are returned unchanged.
   * @param gateway - The IPFS gateway base URL (defaults to ipfs.io)
   * @returns The HTTP-accessible URL
   */
  toGatewayUrl(gateway: string = 'https://ipfs.io/ipfs'): string {
    if (this.isIpfs()) {
      const cid = this._value.replace('ipfs://', '')
      return `${gateway}/${cid}`
    }
    return this._value
  }
}
