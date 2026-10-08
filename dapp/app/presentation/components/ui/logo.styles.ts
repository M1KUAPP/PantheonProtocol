import styled from 'styled-components'

export const LogoText = styled.h1`
  font-family: 'Comic Neue', cursive;
  font-size: ${(props) => props.theme.fontxxl};
  color: ${(props) => props.theme.secondary};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`
