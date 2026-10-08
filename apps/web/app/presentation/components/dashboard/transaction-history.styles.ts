import styled from 'styled-components'

export { StatusBadge } from '@presentation/components/ui/badges.styles'

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const SectionTitle = styled.h2`
  margin-bottom: 0.5rem;
  font-size: ${(props) => props.theme.fontl};
  font-weight: 800;
  color: ${(props) => props.theme.textPrimary};
`

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 15rem;
  padding: 1.5rem;
  border-radius: 1.25rem;
  background-color: ${(props) => props.theme.cardBackground};
  box-shadow: 0 0.125rem 0.625rem rgb(0 0 0 / 5%);
`

export const TableRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 2fr 1.5fr auto 1fr;
  padding: 1rem 0;
  border-bottom: 0.0625rem solid ${(props) => props.theme.borderLight};
  column-gap: 5rem;

  &:last-child {
    border-bottom: none;
  }

  > span {
    color: ${(props) => props.theme.textPrimary};
  }
`

export const TableHeader = styled(TableRow)`
  padding-top: 0;
  font-size: ${(props) => props.theme.fontxs};
  font-weight: 500;
  text-transform: uppercase;
  color: ${(props) => props.theme.textSecondary};
`

export const RecipientCell = styled.div`
  h4 {
    margin: 0;
    font-size: ${(props) => props.theme.fonts};
    color: ${(props) => props.theme.textPrimary};
  }

  p {
    margin: 0;
    font-size: ${(props) => props.theme.fontxs};
    color: ${(props) => props.theme.textSecondary};
  }
`

export const DateCell = styled.div`
  display: flex;
  flex-direction: column;

  > span:first-child {
    color: ${(props) => props.theme.textPrimary};
  }
`

export const TimeSubtext = styled.span`
  margin-top: 0.25rem;
  font-size: ${(props) => props.theme.fontxs};
  color: ${(props) => props.theme.textSecondary};
`

export const UtilityBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
  padding: 0.75rem 0.5rem 0;
  border-top: 0.0625rem solid ${(props) => props.theme.borderLight};
`

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
`

export const PageNumber = styled.span`
  font-size: ${(props) => props.theme.fonts};
  font-weight: 500;
  color: ${(props) => props.theme.textTertiary};
`

export const NavButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.borderLight};
  }

  &:disabled {
    background-color: transparent;
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    stroke: ${(props) => props.theme.textTertiary};
  }
`

export const ExpandButton = styled(NavButton)`
  svg {
    fill: ${(props) => props.theme.textTertiary};
  }
`

export const NoTransactionsText = styled.p`
  padding: 3rem 0;
  text-align: center;
  color: ${(props) => props.theme.textSecondary};
`
