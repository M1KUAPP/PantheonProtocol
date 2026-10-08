import styled, { keyframes } from 'styled-components'

export const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background-color: ${(props) => props.theme.secondary};
  overflow: hidden;
`

const MoveAnimation = keyframes`
  0% { transform: translateX(0%) }
  100% { transform: translateX(-50%) }
`

export const Row = styled.div<{ direction: string }>`
  display: flex;
  margin: 2rem auto;
  box-sizing: content-box;
  white-space: nowrap;
  animation: ${MoveAnimation} 20s linear infinite ${(props) => props.direction};
`

export const ImageContainer = styled.div`
  width: 15rem;
  margin: 0 1rem;
  border-radius: 1.25rem;
  background-color: ${(props) => props.theme.main};
  cursor: pointer;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`

export const Details = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  border: 0.0625rem solid ${(props) => `rgba(${props.theme.mainRgba}, 0.5)`};
  border-radius: 0 0 1.25rem 1.25rem;
  background-color: ${(props) => props.theme.secondary};

  span {
    font-size: ${(props) => props.theme.fonts};
    font-weight: 600;
    line-height: 1.5rem;
    color: ${(props) => `rgba(${props.theme.mainRgba}, 0.5)`};
  }

  h1 {
    font-size: ${(props) => props.theme.fontm};
    font-weight: 600;
    color: ${(props) => props.theme.main};
  }
`

export const Price = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  img {
    width: 1rem;
    height: auto;
  }
`
