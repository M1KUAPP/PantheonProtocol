import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  margin: 3rem 0;
  padding: 1rem 0.5rem;
  border-bottom: 0.0625rem solid ${(props) => props.theme.main};
  cursor: pointer;
`

export const TitleContainer = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${(props) => props.theme.fontl};
`

export const Title = styled.div`
  display: flex;
  align-items: center;
`

export const SubText = styled.p<{ $clicked: boolean }>`
  max-height: ${(props) => (props.$clicked ? '12.5rem' : '0')};
  margin-top: ${(props) => (props.$clicked ? '1rem' : '0')};
  font-size: ${(props) => props.theme.fonts};
  font-weight: 300;
  line-height: 1.1rem;
  color: ${(props) => `rgba(${props.theme.mainRgba}, 0.6)`};
  opacity: ${(props) => (props.$clicked ? '1' : '0')};
  transition:
    max-height 0.4s ease-in-out,
    opacity 0.3s ease-in-out,
    margin-top 0.3s ease-in-out;
  overflow: hidden;
`

export const Indicator = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => props.theme.fontxxl};
  transition: transform 0.3s ease-in-out;

  svg {
    width: 1rem;
    height: auto;
    fill: ${(props) => props.theme.main};
  }
`
