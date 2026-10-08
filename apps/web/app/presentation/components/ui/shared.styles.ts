import styled, { css, keyframes } from 'styled-components'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const ModalContent = styled.div<{ $maxWidth?: string; $maxHeight?: string }>`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: ${(props) => props.$maxWidth ?? '56.25rem'};
  max-height: ${(props) => props.$maxHeight ?? '90vh'};
  border-radius: 1.25rem;
  background-color: ${(props) => props.theme.cardBackground};
  box-shadow: 0 0.625rem 2.5rem rgb(0 0 0 / 15%);
  overflow: hidden;
`

export const ModalHeader = styled.div<{ $withTitle?: boolean; $sticky?: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.$withTitle ? 'space-between' : 'flex-end')};
  align-items: center;
  padding: ${(props) => (props.$withTitle ? '1.5rem' : '1rem')};
  border-bottom: ${(props) => (props.$withTitle ? `0.0625rem solid ${props.theme.borderLight}` : 'none')};
  background-color: ${(props) => props.theme.cardBackground};

  ${(props) =>
    props.$sticky &&
    css`
      position: sticky;
      top: 0;
      border-radius: 1.25rem 1.25rem 0 0;
    `}
`
export const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${(props) => props.theme.fontl};
  font-weight: 800;
  color: ${(props) => props.theme.textPrimary};
`
export const CloseButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: 50%;
  background-color: ${(props) => props.theme.borderLight};
  transition: all 0.2s ease;
  cursor: pointer;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: ${(props) => props.theme.textPrimary};
    stroke: ${(props) => props.theme.textPrimary};
  }

  &:hover {
    background-color: ${(props) => props.theme.border};
  }

  &:active {
    transform: scale(0.95);
  }
`
export const ModalBody = styled.div`
  display: grid;
  gap: 2.5rem;
  grid-template-columns: 1fr 1.2fr;
  padding: 0 2.5rem 2.5rem;
  overflow-y: auto;
`
export const ScrollableContent = styled.div`
  padding: 0 1.5rem 1.5rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 0.25rem;
    background: ${(props) => props.theme.border};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.textSecondary};
  }
`
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 4rem 2rem;
  text-align: center;
`
export const LoadingSpinner = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  width: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return '2.5rem'
      case 'lg':
        return '5rem'
      default:
        return '3.75rem'
    }
  }};
  height: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return '2.5rem'
      case 'lg':
        return '5rem'
      default:
        return '3.75rem'
    }
  }};
  border: ${(props) => (props.$size === 'sm' ? '0.1875rem' : '0.25rem')} solid
    rgba(${(props) => props.theme.secondaryRgba}, 10%);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  border-top-color: ${(props) => props.theme.secondary};
`
export const LoadingText = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fontl};
  color: rgba(${(props) => props.theme.secondaryRgba}, 70%);
`
export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 4rem 2rem;
  text-align: center;
`
export const EmptyStateIcon = styled.div`
  font-size: ${(props) => props.theme.fontxxxl};
  opacity: 0.3;
`
export const EmptyStateTitle = styled.h2`
  margin: 0;
  font-size: ${(props) => props.theme.fontxl};
  font-weight: 600;
  color: ${(props) => props.theme.secondary};
`
export const EmptyStateText = styled.p`
  max-width: 31.25rem;
  margin: 0;
  font-size: ${(props) => props.theme.fontm};
  color: rgba(${(props) => props.theme.secondaryRgba}, 60%);
`
export const ConnectPrompt = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 4rem 2rem;
  text-align: center;
`
export const ConnectPromptText = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fontl};
  color: ${(props) => props.theme.secondary};
`
export const InfoBlock = styled.div`
  padding: 1rem;
  border-radius: 0.625rem;
  background-color: ${(props) => props.theme.infoBgLight};
`
export const InfoLabel = styled.span`
  display: block;
  margin-bottom: 0.25rem;
  font-size: ${(props) => props.theme.fontxs};
  text-transform: uppercase;
  color: ${(props) => props.theme.textSecondary};
`
export const InfoValue = styled.span`
  font-size: ${(props) => props.theme.fontm};
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
`
export const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  margin-bottom: 1.5rem;
`
export const ImageColumn = styled.div`
  > img {
    width: 100%;
    border-radius: 0.9375rem;
    aspect-ratio: 1;
    object-fit: cover;
  }
`
export const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
`
export const Title = styled.h2`
  margin: 0 0 1rem;
  font-size: ${(props) => props.theme.fontxxl};
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
`
export const Description = styled.p`
  margin: 0 0 1.5rem;
  font-size: ${(props) => props.theme.fontm};
  line-height: 1.6;
  color: ${(props) => props.theme.textSecondary};
`
