import styled from 'styled-components'

export const Btn = styled.button<{ disabled?: boolean }>`
  display: inline-block;
  padding: 0.9rem 2.5rem;
  border: none;
  border-radius: 3.125rem;
  font-size: ${(props) => props.theme.fonts};
  color: ${(props) => props.theme.main};
  background-color: ${(props) => props.theme.secondary};
  opacity: 1;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(0.9);
  }

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border: 0.125rem solid ${(props) => props.theme.secondary};
    border-radius: 3.125rem;
    transform: translate(-50%, -50%) scale(0);
    transition: all 0.2s ease;
    content: '';
  }

  &:hover::after {
    padding: 0.3rem;
    transform: translate(-50%, -50%) scale(1);
  }
`
