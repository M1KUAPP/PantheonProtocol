import styled from 'styled-components'

export const Section = styled.section`
  width: 100vw;
  background-color: ${(props) => props.theme.main};
`

export const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 85%;
  height: ${(props) => props.theme.navHeight};
  margin: 0 auto;
`

export const MenuItems = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
`

export const MenuItem = styled.li`
  margin: 0 1rem;
  color: ${(props) => props.theme.secondary};
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
