import { ValueObject } from '@core/value-objects/base/value-object.base'

/**
 * Abstract base class for string-based value objects that must conform to a specific pattern.
 *
 * This class provides a foundation for creating validated string value objects such as
 * email addresses, URLs, Ethereum addresses, or any string that must match a regex pattern.
 *
 * @typeParam T - The string literal or string type for the value
 *
 * @example
 * ```typescript
 * class Email extends StringPatternValueObject {
 *   private static readonly PATTERN = /^[\w-]+@[\w-]+\.\w+$/;
 *
 *   static create(value: string): Email {
 *     if (!this.isValidPattern(value, Email.PATTERN)) {
 *       throw new Error('Invalid email format');
 *     }
 *     return new Email(value);
 *   }
 * }
 * ```
 */
export abstract class StringPatternValueObject<T extends string = string> extends ValueObject<T> {
  /**
   * Creates a new StringPatternValueObject instance.
   * @param value - The validated string value
   */
  protected constructor(value: T) {
    super(value)
  }

  /**
   * Validates a string against a regular expression pattern.
   * @param value - The string to validate
   * @param pattern - The regex pattern to test against
   * @returns True if the value matches the pattern, false otherwise
   */
  protected static isValidPattern(value: string, pattern: RegExp): boolean {
    return pattern.test(value)
  }

  /**
   * Compares this value object with another for equality.
   * @param other - The value object to compare against
   * @returns True if the string values are identical
   */
  equals(other: StringPatternValueObject<T>): boolean {
    return this._value === other._value
  }
}
