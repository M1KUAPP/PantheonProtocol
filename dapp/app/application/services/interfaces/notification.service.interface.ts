/**
 * Severity levels for toast notifications.
 */
export enum NotificationLevel {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Loading = 'loading'
}

/**
 * Service interface for displaying user notifications/toasts.
 *
 * Provides methods for showing different types of notifications
 * and managing their lifecycle (update, dismiss).
 */
export interface INotificationService {
  success(message: string, duration?: number): string
  error(message: string, duration?: number): string
  info(message: string, duration?: number): string
  warning(message: string, duration?: number): string
  loading(message: string): string
  update(toastId: string, level: NotificationLevel, message: string): void
  dismiss(toastId?: string): void
  dismissAll(): void
}
