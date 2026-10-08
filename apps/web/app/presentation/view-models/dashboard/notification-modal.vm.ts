/**
 * Notification modal view model for displaying notification history.
 *
 * Subscribes to the notification store and provides modal state management
 * for viewing and clearing past notifications.
 * @module
 */

import type { StoredNotification } from '@presentation/services/notification-store.service'
import { NotificationStore } from '@presentation/services/notification-store.service'
import { useEffect, useState } from 'react'

/**
 * Hook that manages the notification modal state.
 *
 * Provides reactive access to stored notifications and controls for
 * opening, closing, and clearing the notification history.
 * @returns Modal state and action handlers.
 */
export function useNotificationModalViewModel() {
  const [notifications, setNotifications] = useState<StoredNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    const unsubscribe = NotificationStore.subscribe(setNotifications)
    return unsubscribe
  }, [])
  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)
  const clearAll = () => NotificationStore.clearAll()
  return {
    isOpen,
    notifications,
    toggle,
    close,
    clearAll
  }
}
