import styled from 'styled-components'

export const Section = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.secondary};
`

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75%;
  min-height: 80vh;
  margin: 0 auto;
`

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
`

export const Title = styled.h2`
  width: 80%;
  margin: 0 auto;
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.main};
  align-self: flex-start;
`

export const SubText = styled.p`
  width: 80%;
  margin: 1rem auto;
  font-size: ${(props) => props.theme.fontl};
  font-weight: 400;
  color: ${(props) => props.theme.main};
  align-self: flex-start;
`

export const Caption = styled.p`
  width: 80%;
  margin: 1rem auto;
  font-size: ${(props) => props.theme.fontm};
  font-weight: 400;
  color: ${(props) => `rgba(${props.theme.mainRgba}, 0.6)`};
  align-self: flex-start;
`

export const ButtonContainer = styled.div`
  width: 80%;
  margin: 1rem auto;
  align-self: flex-start;
`
