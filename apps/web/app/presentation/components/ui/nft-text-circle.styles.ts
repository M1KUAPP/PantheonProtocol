import styled, { keyframes } from 'styled-components'

const RotateAnimation = keyframes`
  100% {
    transform: rotate(1turn);
  }
`

export const NFTText = styled.div`
  position: absolute;
  right: 90%;
  bottom: 2rem;
  width: 6rem;
  height: 6rem;
  border: 0.0625rem solid ${(props) => props.theme.secondary};
  border-radius: 50%;

  img {
    width: 100%;
    height: auto;
    animation: ${RotateAnimation} 6s linear infinite reverse;
  }
`

export const NFTCircle = styled.span.attrs<{ $rotation: number }>((props) => ({
  style: { transform: `translate(-50%, -50%) rotate(${props.$rotation}deg)` }
}))<{ $rotation: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.secondary};
  transition: transform 0.1s ease-out;
`
