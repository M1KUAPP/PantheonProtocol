import styled from 'styled-components'

export const CopyButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  svg {
    width: 1rem;
    height: 1rem;
    opacity: 0.5;
    transition: all 0.2s ease-in-out;
  }

  &:hover {
    background-color: rgba(${(props) => props.theme.mainRgba}, 20%);

    svg {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  &:active {
    transform: scale(0.95);
  }
`

export const IconWrapper = styled.span<{ $color: string }>`
  display: inline-flex;
  color: ${(props) => props.$color};
`
