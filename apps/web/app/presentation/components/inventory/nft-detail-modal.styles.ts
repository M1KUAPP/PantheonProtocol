import { InfoValue } from '@presentation/components/ui/shared.styles'
import styled from 'styled-components'

export { StatusBadge } from '@presentation/components/ui/badges.styles'
export {
  CloseButton,
  Description,
  ImageColumn,
  InfoBlock,
  InfoColumn,
  InfoGrid,
  InfoLabel,
  InfoValue,
  ModalBody,
  ModalContent,
  ModalHeader,
  Title
} from '@presentation/components/ui/shared.styles'

export const StatusContainer = styled.div`
  margin-top: auto;
  padding: 1.5rem;
  border-radius: 0.625rem;
  background-color: ${(props) => props.theme.infoBgLight};
`

export const StatusBadgeWrapper = styled.div`
  margin-top: 0.75rem;
`

export const ListingPriceContainer = styled.div`
  margin-top: 1rem;
`

export const ListingPriceValue = styled(InfoValue)`
  display: block;
  margin-top: 0.5rem;
  font-size: 1.5rem;
`
