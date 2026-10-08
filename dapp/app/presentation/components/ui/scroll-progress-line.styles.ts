import styled, { keyframes } from 'styled-components'

export const Container = styled.div<{
  $strokeDasharray: number
  $strokeDashoffset: number
}>`
  position: absolute;
  top: 0.5rem;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translateX(-50%);
  overflow: hidden;

  svg {
    width: 100%;
    height: 100%;
  }

  .svg-path {
    stroke-dasharray: ${(props) => props.$strokeDasharray};
    stroke-dashoffset: ${(props) => props.$strokeDashoffset};
  }
`

const BounceAnimation = keyframes`
  from {
    transform: translateX(-50%) scale(0.5);
  }
  to {
    transform: translateX(-50%) scale(1);
  }
`

export const Ball = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  display: ${(props) => (props.$isVisible ? 'block' : 'none')};
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.secondary};
  transform: translateX(-50%);
  animation: ${BounceAnimation} 0.5s linear infinite alternate;
`
