import styled, { type DefaultTheme } from 'styled-components'

type NFTStatus = 'available' | 'listed' | 'locked'
type TransactionStatus = 'Success' | 'Pending' | 'Failed'

type BadgeStatus = NFTStatus | TransactionStatus

const getStatusColor = (status: BadgeStatus, theme: DefaultTheme): string => {
  switch (status) {
    case 'locked':
    case 'Failed':
      return theme.error
    case 'listed':
      return theme.warning
    case 'available':
    case 'Success':
      return theme.success
    case 'Pending':
      return theme.secondary
    default:
      return theme.secondary
  }
}

export const StatusBadge = styled.span<{
  $status: BadgeStatus
  $position?: 'absolute' | 'inline'
}>`
  display: ${(props) => (props.$position === 'absolute' ? 'block' : 'inline-block')};
  ${(props) =>
    props.$position === 'absolute' &&
    `
    position: absolute;
    top: 0.625rem;
    right: 0.625rem;
  `}
  padding: 0.4rem 0.8rem;
  border-radius: 1.25rem;
  font-size: ${(props) => props.theme.fontxs};
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  color: ${(props) => props.theme.statusText};
  background-color: ${(props) => getStatusColor(props.$status, props.theme)};
`
