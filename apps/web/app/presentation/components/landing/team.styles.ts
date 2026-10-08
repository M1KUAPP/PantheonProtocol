import styled from 'styled-components'

export const Section = styled.section`
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background-color: ${(props) => props.theme.main};
`

export const Title = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.secondary};
`

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 75%;
  margin: 2rem auto;
`

export const MemberContainer = styled.div`
  position: relative;
  z-index: 100;
  width: calc(20rem - 4vw);
  margin: 2rem 1rem;
  padding: 1rem;
  border: 0.0625rem solid ${(props) => props.theme.secondary};
  border-radius: 1.25rem;
  color: ${(props) => props.theme.main};
  backdrop-filter: blur(0.625rem);

  &:hover {
    svg {
      transform: translateY(-2rem) scale(1.2);
    }
  }
`

export const ImageContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 1rem;
  border: 0.03rem solid ${(props) => props.theme.secondary};
  border-radius: 1.25rem;
  background-color: ${(props) => `rgba(${props.theme.supportRgba}, 0.5)`};
  cursor: pointer;
  backdrop-filter: blur(0.625rem);

  svg {
    width: 100%;
    height: auto;
    transition: all 0.2s ease;
  }
`

export const Name = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  font-size: ${(props) => props.theme.fontl};
  text-transform: uppercase;
  color: ${(props) => props.theme.secondary};
`

export const Position = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  font-size: ${(props) => props.theme.fontm};
  font-weight: 400;
  text-transform: capitalize;
  color: ${(props) => `rgba(${props.theme.secondaryRgba}, 0.9)`};
`
