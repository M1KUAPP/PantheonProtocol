/**
 * In-memory notification store for persisting and subscribing to notifications.
 *
 * Provides a reactive store for notifications that components can subscribe to,
 * enabling real-time UI updates when new notifications are added.
 * @module
 */

import type { NotificationLevel } from '@application/services/interfaces/notification.service.interface'

/**
 * Represents a notification stored in the notification history.
 */
export interface StoredNotification {
  /** Unique identifier for the notification. */
  id: number
  /** The notification message content. */
  message: string
  /** The severity level of the notification. */
  type: NotificationLevel
  /** When the notification was created. */
  timestamp: Date
}

/** Callback function type for notification subscriptions. */
type Subscriber = (notifications: StoredNotification[]) => void

/**
 * Internal implementation of the notification store.
 *
 * Manages notification state and subscriber callbacks using an observer pattern.
 */
class NotificationStoreImpl {
  private notifications: StoredNotification[] = []
  private subscribers: Set<Subscriber> = new Set()
  private nextId = 1

  /**
   * Subscribes to notification changes.
   * @param callback - Function called with current notifications on subscribe and on changes.
   * @returns Unsubscribe function.
   */
  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback)
    callback(this.notifications)
    return () => this.subscribers.delete(callback)
  }

  /**
   * Adds a new notification to the store.
   * @param message - The notification message.
   * @param type - The notification severity level.
   */
  addNotification(message: string, type: NotificationLevel) {
    const newNotification: StoredNotification = {
      id: this.nextId++,
      message,
      type,
      timestamp: new Date()
    }
    this.notifications = [newNotification, ...this.notifications]
    this.emitChange()
  }

  /** Clears all stored notifications. */
  clearAll() {
    this.notifications = []
    this.emitChange()
  }

  /** Notifies all subscribers of state changes. */
  private emitChange() {
    for (const subscriber of this.subscribers) {
      subscriber(this.notifications)
    }
  }
}

/** Singleton notification store instance for application-wide notification management. */
export const NotificationStore = new NotificationStoreImpl()
