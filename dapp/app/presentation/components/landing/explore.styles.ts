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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 200vh;
  margin: 0 auto;
  background-color: ${(props) => props.theme.main};
`

export const LineContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const InfoItems = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  list-style: none;

  div {
    border-radius: 0 3.125rem;
    text-align: left;
  }

  p {
    border-radius: 0 2.5rem;
  }

  & > *:nth-of-type(2n + 1) {
    justify-content: start;

    div {
      border-radius: 3.125rem 0;
      text-align: right;
    }

    p {
      border-radius: 2.5rem 0;
    }
  }

  & > *:nth-of-type(2n) {
    justify-content: end;
  }
`

export const InfoItem = styled.li`
  display: flex;
  width: 100%;
  height: 100%;
`

export const ItemContainer = styled.div<{
  $translateY: string
  $opacity: number
}>`
  width: 40%;
  height: fit-content;
  padding: 1rem;
  border: 0.1875rem solid ${(props) => props.theme.secondary};
  opacity: ${(props) => props.$opacity};
  transform: translateY(${(props) => props.$translateY});
  transition:
    transform 0.1s linear,
    opacity 0.1s linear;
`

export const ItemBox = styled.p`
  position: relative;
  height: fit-content;
  padding: 1rem;
  border-radius: 0.0625rem solid ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.secondary};
  background-color: ${(props) => props.theme.support};
`

export const ItemTitle = styled.span`
  display: block;
  font-size: ${(props) => props.theme.fontxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.secondary};
`

export const ItemText = styled.span`
  display: block;
  margin: 0.5rem;
  font-size: ${(props) => props.theme.fonts};
  font-weight: 400;
  text-transform: capitalize;
  color: ${(props) => props.theme.secondary};
`
