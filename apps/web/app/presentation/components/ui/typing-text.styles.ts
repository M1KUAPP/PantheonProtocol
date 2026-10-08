import styled from 'styled-components'

export const Title = styled.h2`
  width: 80%;
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.secondary};
  align-self: flex-start;

  span {
    font-family: 'Comic Neue', cursive;
    text-transform: uppercase;
  }
`

export const SubText = styled.h3`
  width: 80%;
  margin-bottom: 1rem;
  font-size: ${(props) => props.theme.fontl};
  font-weight: 600;
  text-transform: capitalize;
  color: ${(props) => `rgba(${props.theme.secondaryRgba}, 0.6)`};
  align-self: flex-start;
`

export const ButtonContainer = styled.div`
  width: 80%;
  align-self: flex-start;
`
