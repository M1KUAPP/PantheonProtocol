/**
 * Notification history modal component.
 *
 * Displays a list of past notifications with timestamps and
 * a button to clear all notifications.
 * @module
 */

import { XMarkIcon } from '@heroicons/react/24/outline'
import { CustomBackdrop } from '@presentation/components/common/backdrop'
import {
  CloseButton,
  EmptyState,
  MarkAllReadButton,
  ModalContainer,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  NotificationItem,
  NotificationList,
  NotificationMessage,
  TimestampContainer
} from '@presentation/components/common/notification-modal.styles'
import type { StoredNotification } from '@presentation/services/notification-store.service'

/** Props for the NotificationModal component. */
interface NotificationModalProps {
  notifications: StoredNotification[]
  onClearAll: () => void
  onClose: () => void
}

/** Modal displaying notification history with clear-all functionality. */
export const NotificationModal = ({ notifications, onClearAll, onClose }: NotificationModalProps) => {
  return (
    <>
      <CustomBackdrop onClick={onClose} />
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Notifications</ModalTitle>
          <CloseButton onClick={onClose} title="Close">
            <XMarkIcon width={24} height={24} />
          </CloseButton>
        </ModalHeader>
        <NotificationList>
          {notifications.length > 0 ? (
            notifications.map((notif) => {
              const dayTimeFormatter = new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })
              const dateFormatter = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
              const dayTime = dayTimeFormatter.format(notif.timestamp)
              const date = dateFormatter.format(notif.timestamp)
              return (
                <NotificationItem key={notif.id}>
                  <NotificationMessage>{notif.message}</NotificationMessage>
                  <TimestampContainer>
                    <span>{dayTime}</span>
                    <span>{date}</span>
                  </TimestampContainer>
                </NotificationItem>
              )
            })
          ) : (
            <EmptyState>No new notifications</EmptyState>
          )}
        </NotificationList>
        <ModalFooter>
          <MarkAllReadButton onClick={onClearAll}>Mark all as read</MarkAllReadButton>
        </ModalFooter>
      </ModalContainer>
    </>
  )
}
