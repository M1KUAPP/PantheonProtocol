import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  width: 25vw;
  height: 70vh;

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1.25rem;
    background-color: ${(props) => props.theme.support};
  }
`

export const NavButton = styled.button`
  position: absolute;
  top: 55%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 4rem;
  padding: 0;
  border: none;
  background: transparent;
  opacity: 0;
  transform: translateY(-50%);
  transition: opacity 0.3s ease;
  cursor: pointer;

  ${Container}:hover & {
    opacity: 1;
  }
`

export const NextButton = styled(NavButton)`
  right: 0;
`

export const PrevButton = styled(NavButton)`
  left: 0;
`
