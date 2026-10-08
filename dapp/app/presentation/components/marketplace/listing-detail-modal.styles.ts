import styled from 'styled-components'

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

export const SellerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
`

export const SellerLabel = styled.span`
  font-size: ${(props) => props.theme.fontxs};
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${(props) => props.theme.textSecondary};
`

export const SellerDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const SellerAvatar = styled.img`
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.borderLight};
  object-fit: cover;
  flex-shrink: 0;
`

export const SellerAddress = styled.span`
  font-size: ${(props) => props.theme.fonts};
  font-weight: 600;
  white-space: nowrap;
  color: ${(props) => props.theme.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
`

export const PriceContainer = styled.div`
  margin-top: auto;
  padding: 1.5rem;
  border-radius: 0.625rem;
  background-color: ${(props) => props.theme.infoBgLight};
`

export const PriceValue = styled.p`
  margin: 0 0 1rem;
  font-size: ${(props) => props.theme.fontxl};
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
`

export const BuyButton = styled.button<{ $state: 'idle' | 'confirming' | 'sold' }>`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 0.625rem;
  font-size: ${(props) => props.theme.fontl};
  font-weight: 600;
  color: ${(props) => props.theme.main};
  background-color: ${(props) => {
    switch (props.$state) {
      case 'confirming':
        return props.theme.connectButton
      case 'sold':
        return props.theme.disconnectButton
      case 'idle':
      default:
        return props.theme.secondary
    }
  }};
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`
