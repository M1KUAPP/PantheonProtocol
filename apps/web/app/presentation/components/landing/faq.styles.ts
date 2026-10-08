import styled from 'styled-components'

export const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  color: ${(props) => props.theme.main};
  background-color: ${(props) => props.theme.secondary};
`

export const Title = styled.h1`
  margin: 1rem auto;
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: uppercase;
  color: ${(props) => props.theme.main};
`

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  width: 75%;
  margin: 2rem auto;
`
