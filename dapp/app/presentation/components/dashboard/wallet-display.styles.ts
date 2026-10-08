import styled, { keyframes } from 'styled-components'

export const WALLET_DISPLAY_ANIMATION = {
  RAINDROP_DENSITY: 20,
  MIN_DURATION_S: 4,
  MAX_DURATION_S: 5
} as const

const rainFall = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    transform: translateY(14.75rem);
    opacity: 0;
  }
`

export const Raindrop = styled.div`
  position: absolute;
  top: -10%;
  z-index: 0;
  width: 2rem;
  height: 2rem;
  opacity: 0.15;
  animation: ${rainFall} linear infinite;

  svg {
    width: 100%;
    height: 100%;
    opacity: 0.6;
    filter: brightness(1);
  }
`

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

export const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.fontl};
  font-weight: 800;
  color: ${(props) => props.theme.textPrimary};
`

export const AddressText = styled.p`
  margin-bottom: 0.5rem;
  font-size: ${(props) => props.theme.fontxs};
  font-weight: 800;
  color: white;
`

export const WalletCard = styled.div<{ $isHidden: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 13.75rem;
  padding: 1.5rem;
  border-radius: 1.25rem;
  color: ${(props) => props.theme.main};
  background-color: ${(props) => props.theme.accent1};
  box-shadow: 0 0.25rem 0.9375rem rgb(0 0 0 / 15%);
  transition: all 0.3s ease-in-out;
  overflow: hidden;

  &:hover {
    box-shadow: 0 0.9375rem 1.875rem -0.3125rem rgb(0 0 0 / 15%);
    transform: translateY(-0.3125rem);
  }

  &::after {
    position: absolute;
    right: -1rem;
    bottom: -1.15rem;
    z-index: 0;
    font-size: 10rem;
    font-weight: 800;
    line-height: 1;
    color: rgba(${(props) => props.theme.mainRgba}, 15%);
    transition: filter 0.3s ease-in-out;
    content: 'PP.';
    filter: ${(props) => (props.$isHidden ? 'blur(6px)' : 'none')};
  }
`

export const CardHeader = styled.div`
  position: relative;
  z-index: 1;
`

export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  button {
    svg {
      width: 1.2rem;
      height: 1.2rem;
    }
  }
`

export const CardNumber = styled.p<{ $isHidden: boolean }>`
  position: relative;
  z-index: 1;
  font-size: ${(props) => props.theme.fontl};
  line-height: 1.5;
  letter-spacing: 0.08rem;
  word-break: break-all;
  color: white;
  transition: filter 0.3s ease-in-out;
  user-select: ${(props) => (props.$isHidden ? 'none' : 'auto')};
  filter: ${(props) => (props.$isHidden ? 'blur(6px)' : 'none')};
`

export const CardFooter = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
  font-size: ${(props) => props.theme.fonts};
  text-transform: uppercase;
`

export const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
`

export const SliderTrack = styled.div<{ $isActive: boolean }>`
  position: relative;
  width: 2.25rem;
  height: 1.25rem;
  border: 1px solid rgb(255 255 255 / 50%);
  border-radius: 0.625rem;
  background-color: ${(props) => (props.$isActive ? 'rgba(255, 255, 255, 0.3)' : `rgba(255, 255, 255, 0.3)`)};
  transition: background-color 0.3s ease;
`

export const SliderThumb = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: white;
  transform: ${(props) => (props.$isActive ? 'translateX(1rem)' : 'translateX(0)')};
  transition: transform 0.3s ease;
`

export const HideText = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fonts};
  font-weight: 800;
  color: white;
`

export const ConnectedStatus = styled.div<{ $isConnected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  color: ${(props) => props.theme.main};
`

export const ConnectedText = styled.span`
  font-size: ${(props) => props.theme.fonts};
  font-weight: 700;
  color: white;
`

export const StatusIcon = styled.div<{ $isConnected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  color: white;
  background-color: ${(props) => (props.$isConnected ? props.theme.success : props.theme.error)};

  svg {
    width: 1rem;
    height: 1rem;
  }
`
