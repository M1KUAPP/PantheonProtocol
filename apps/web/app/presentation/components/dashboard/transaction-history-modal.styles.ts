import { TableHeader } from '@presentation/components/dashboard/transaction-history.styles'
import styled from 'styled-components'

export {
  CloseButton,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ScrollableContent
} from '@presentation/components/ui/shared.styles'

export const ModalTableHeader = styled(TableHeader)`
  position: sticky;
  top: 4.5625rem;
  margin: 0;
  padding: 1rem 1.5rem;
  border-bottom: 0.0625rem solid ${(props) => props.theme.borderLight};
  background-color: ${(props) => props.theme.cardBackground};
`
