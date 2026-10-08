import styled from 'styled-components'

export const ModalContainer = styled.div`
  position: fixed;
  top: 6rem;
  right: 7.5rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 25rem;
  max-height: 30rem;
  border: 1px solid ${(props) => props.theme.borderLight};
  border-radius: 0.75rem;
  background-color: ${(props) => props.theme.cardBackground};
  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 15%);
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${(props) => props.theme.borderLight};
  flex-shrink: 0;
`

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${(props) => props.theme.fontl};
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
`

export const CloseButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.2s ease;
  cursor: pointer;

  svg {
    width: 1rem;
    height: 1rem;
    stroke: ${(props) => props.theme.textPrimary};
  }

  &:hover {
    background-color: ${(props) => props.theme.borderLight};
  }
`

export const NotificationList = styled.ul`
  margin: 0;
  padding: 0.5rem;
  overflow-y: auto;
  list-style: none;
  flex-grow: 1;
`

export const NotificationItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.borderLight};

  &:last-child {
    border-bottom: none;
  }
`

export const NotificationMessage = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fonts};
  color: ${(props) => props.theme.textPrimary};
`

export const TimestampContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${(props) => props.theme.fontxs};
  color: ${(props) => props.theme.textSecondary};
`

export const EmptyState = styled.div`
  padding: 3rem 1.5rem;
  text-align: center;
  color: ${(props) => props.theme.textSecondary};
`

export const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${(props) => props.theme.borderLight};
  text-align: center;
  flex-shrink: 0;
`

export const MarkAllReadButton = styled.button`
  border: none;
  font-size: ${(props) => props.theme.fonts};
  font-weight: 600;
  color: ${(props) => props.theme.accent2};
  background: none;
  transition: opacity 0.2s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`
