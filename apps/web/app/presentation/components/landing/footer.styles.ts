import styled from 'styled-components'

export const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  color: ${(props) => props.theme.secondary};
  background-color: ${(props) => props.theme.main};
`

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 75%;
  margin: 2rem auto;
`

export const BannerContainer = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 25rem;
  border-top: 0.125rem solid ${(props) => props.theme.secondary};
  background-color: ${(props) => `rgba(${props.theme.secondaryRgba},0.9)`};
  overflow: hidden;
`

export const Title = styled.h1`
  width: 35%;
  padding: 1rem 2rem;
  font-size: ${(props) => props.theme.fontxxxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.main};
  text-shadow: 0.0625rem 0.0625rem 0.125rem ${(props) => props.theme.secondary};
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 35%;
  font-size: ${(props) => props.theme.fontxl};
`

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const SocialIcons = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem auto;

  & > * {
    padding-right: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`

export const MenuItems = styled.ul`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 50%;
  list-style: none;
`

export const MenuItem = styled.li`
  width: fit-content;
  cursor: pointer;

  &::after {
    display: block;
    width: 0%;
    height: 0.125rem;
    background: ${(props) => props.theme.secondary};
    transition: width 0.2s ease;
    content: '';
  }

  &:hover::after {
    width: 100%;
  }
`

export const AuthorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 75%;
  margin: 0 auto;
  padding: 1rem 0;
  border-top: 0.0625rem solid ${(props) => props.theme.secondary};
`
