/**
 * Toast notification service using react-hot-toast.
 *
 * Implements the notification service interface to display styled toast
 * notifications with different severity levels and customizable durations.
 * @module
 */

import type { INotificationService } from '@application/services/interfaces/notification.service.interface'
import { NotificationLevel } from '@application/services/interfaces/notification.service.interface'
import { NotificationStore } from '@presentation/services/notification-store.service'
import toast, { Toaster } from 'react-hot-toast'

/**
 * Toast-based notification service implementation.
 *
 * Displays visually styled toast notifications at the bottom of the screen,
 * with colors and icons appropriate for each notification level.
 */
export class ToastNotificationService implements INotificationService {
  private readonly defaultDuration = 4000
  private readonly defaultPosition = 'bottom-center' as const

  /**
   * Shows a success toast notification.
   * @param message - The success message to display.
   * @param duration - How long to show the toast in milliseconds.
   * @returns The toast ID for later reference.
   */
  success(message: string, duration: number = this.defaultDuration): string {
    NotificationStore.addNotification(message, NotificationLevel.Success)
    return toast.success(message, {
      duration,
      position: this.defaultPosition,
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: '500'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981'
      }
    })
  }

  /**
   * Shows an error toast notification.
   * @param message - The error message to display.
   * @param duration - How long to show the toast in milliseconds.
   * @returns The toast ID for later reference.
   */
  error(message: string, duration: number = this.defaultDuration): string {
    return toast.error(message, {
      duration,
      position: this.defaultPosition,
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: '500'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444'
      }
    })
  }

  /**
   * Shows an informational toast notification.
   * @param message - The info message to display.
   * @param duration - How long to show the toast in milliseconds.
   * @returns The toast ID for later reference.
   */
  info(message: string, duration: number = this.defaultDuration): string {
    return toast(message, {
      duration,
      position: this.defaultPosition,
      icon: 'i',
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: '500'
      }
    })
  }

  /**
   * Shows a warning toast notification.
   * @param message - The warning message to display.
   * @param duration - How long to show the toast in milliseconds.
   * @returns The toast ID for later reference.
   */
  warning(message: string, duration: number = this.defaultDuration): string {
    return toast(message, {
      duration,
      position: this.defaultPosition,
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
        fontWeight: '500'
      }
    })
  }

  /**
   * Shows a loading toast notification that persists until dismissed.
   * @param message - The loading message to display.
   * @returns The toast ID for updating or dismissing later.
   */
  loading(message: string): string {
    return toast.loading(message, {
      position: this.defaultPosition,
      style: {
        background: '#6366f1',
        color: '#fff',
        fontWeight: '500'
      }
    })
  }

  /**
   * Updates an existing toast with a new level and message.
   * @param toastId - The ID of the toast to update.
   * @param level - The new notification level.
   * @param message - The new message to display.
   */
  update(toastId: string, level: NotificationLevel, message: string): void {
    const baseStyle = {
      position: this.defaultPosition,
      duration: this.defaultDuration,
      style: {
        color: '#fff',
        fontWeight: '500'
      }
    } as const
    switch (level) {
      case NotificationLevel.Success:
        toast.success(message, {
          ...baseStyle,
          id: toastId,
          style: {
            ...baseStyle.style,
            background: '#10b981'
          }
        })
        break
      case NotificationLevel.Error:
        toast.error(message, {
          ...baseStyle,
          id: toastId,
          style: {
            ...baseStyle.style,
            background: '#ef4444'
          }
        })
        break
      case NotificationLevel.Info:
        toast(message, {
          ...baseStyle,
          id: toastId,
          icon: 'i',
          style: {
            ...baseStyle.style,
            background: '#3b82f6'
          }
        })
        break
      case NotificationLevel.Warning:
        toast(message, {
          ...baseStyle,
          id: toastId,
          icon: '⚠️',
          style: {
            ...baseStyle.style,
            background: '#f59e0b'
          }
        })
        break
      case NotificationLevel.Loading:
        toast.loading(message, {
          ...baseStyle,
          id: toastId,
          duration: Infinity,
          style: {
            ...baseStyle.style,
            background: '#6366f1'
          }
        })
        break
    }
  }

  /**
   * Dismisses a specific toast or the most recent one.
   * @param toastId - Optional ID of the toast to dismiss.
   */
  dismiss(toastId?: string): void {
    toast.dismiss(toastId)
  }

  /** Dismisses all currently visible toasts. */
  dismissAll(): void {
    toast.dismiss()
  }
}

export { Toaster }
