type ValidationSuccess = { valid: true; value: number }
type ValidationFailure = { valid: false; message: string }
type ValidationResult = ValidationSuccess | ValidationFailure

export function validateUid(uid: string): ValidationResult {
  if (!uid) {
    return { valid: false, message: 'Asset UID is required' }
  }
  const numericUid = parseInt(uid, 10)
  if (isNaN(numericUid) || numericUid <= 0) {
    return { valid: false, message: 'Asset UID must be a positive number' }
  }
  return { valid: true, value: numericUid }
}
