import styled from 'styled-components'

export const Section = styled.section`
  position: relative;
  width: 100vw;
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  background-color: ${(props) => props.theme.main};
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

export const VideoContainer = styled.div`
  width: 110%;

  video {
    width: 100%;
    height: auto;
    border-radius: 50%;
  }
`
