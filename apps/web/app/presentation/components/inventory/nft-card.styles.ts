import styled from 'styled-components'

export { StatusBadge } from '@presentation/components/ui/badges.styles'
export { TextInput as PriceInput } from '@presentation/components/ui/form.styles'
export { LoadingSpinner } from '@presentation/components/ui/shared.styles'

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.125rem solid rgba(${(props) => props.theme.secondaryRgba}, 10%);
  border-radius: 1.25rem;
  background-color: ${(props) => props.theme.main};
  box-shadow: 0 0.25rem 0.375rem rgb(0 0 0 / 10%);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    border-color: rgba(${(props) => props.theme.secondaryRgba}, 30%);
    box-shadow: 0 0.5rem 0.75rem rgb(0 0 0 / 15%);
    transform: translateY(-0.3125rem);
  }

  &:active {
    transform: scale(0.98);
  }
`

export const ImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: rgba(${(props) => props.theme.secondaryRgba}, 5%);
  overflow: hidden;
  aspect-ratio: 1;
`

export const NFTImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
`

export const NFTTitle = styled.h3`
  margin: 0;
  font-size: ${(props) => props.theme.fontl};
  font-weight: 600;
  white-space: nowrap;
  color: ${(props) => props.theme.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
`

export const NFTInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${(props) => props.theme.fonts};
  color: rgba(${(props) => props.theme.secondaryRgba}, 70%);
`

export const InfoLabel = styled.span`
  font-weight: 500;
`

export const WarningLabel = styled(InfoLabel)`
  color: ${(props) => props.theme.warning};
`

export const InfoValue = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.secondary};
`

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;

  & > * {
    position: relative;
    z-index: 1;
  }
`

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger'
}>`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.625rem;
  font-size: ${(props) => props.theme.fonts};
  font-weight: 600;
  color: ${(props) => {
    switch (props.$variant) {
      case 'danger':
        return props.theme.error
      case 'secondary':
        return props.theme.secondary
      default:
        return props.theme.main
    }
  }};
  background-color: ${(props) => {
    switch (props.$variant) {
      case 'danger':
        return props.theme.errorBg
      case 'secondary':
        return `rgba(${props.theme.secondaryRgba}, 0.1)`
      default:
        return props.theme.secondary
    }
  }};
  transition: all 0.2s ease;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
    box-shadow: 0 4px 8px rgb(0 0 0 / 15%);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

export const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`
