/**
 * Abstract base class for implementing the Value Object pattern.
 *
 * Value Objects are immutable domain primitives that are defined by their attributes
 * rather than by a unique identity. Two value objects are considered equal if all
 * their attributes are equal.
 *
 * @typeParam T - The type of the encapsulated value
 *
 * @example
 * ```typescript
 * class Email extends ValueObject<string> {
 *   static create(value: string): Email {
 *     if (!value.includes('@')) throw new Error('Invalid email');
 *     return new Email(value);
 *   }
 *   equals(other: Email): boolean {
 *     return this._value === other._value;
 *   }
 * }
 * ```
 */
export abstract class ValueObject<T> {
  /** The encapsulated immutable value */
  protected readonly _value: T

  /**
   * Creates a new ValueObject instance.
   * @param value - The value to encapsulate
   */
  protected constructor(value: T) {
    this._value = value
  }

  /**
   * Gets the encapsulated value.
   * @returns The underlying value
   */
  get value(): T {
    return this._value
  }

  /**
   * Converts the value to its string representation.
   * @returns String representation of the value
   */
  toString(): string {
    return String(this._value)
  }

  /**
   * Compares this value object with another for equality.
   * @param other - The value object to compare against
   * @returns True if the value objects are equal, false otherwise
   */
  abstract equals(other: ValueObject<T>): boolean
}
