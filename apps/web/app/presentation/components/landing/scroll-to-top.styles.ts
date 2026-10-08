import styled from 'styled-components'

export const ArrowContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  box-sizing: border-box;
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.secondary};
  background: ${(props) => `rgba(${props.theme.mainRgba}, 0.5)`};
  opacity: ${(props) => (props.$isVisible ? '1' : '0')};
  transform: ${(props) => (props.$isVisible ? 'scale(1)' : 'scale(0)')};
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
  pointer-events: ${(props) => (props.$isVisible ? 'auto' : 'none')};
  backdrop-filter: blur(0.625rem);

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.9);
  }
`
