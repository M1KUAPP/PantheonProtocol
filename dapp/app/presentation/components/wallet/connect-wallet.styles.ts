import styled, { keyframes } from 'styled-components'

const popOut = keyframes`
  0% { transform: scale(0) translateX(20px); }
  50% { transform: scale(1.2) translateX(0); }
  100% { transform: scale(1) translateX(0); }
`

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const DashboardButton = styled.button<{ $isVisible: boolean }>`
  position: relative;
  display: ${(props) => (props.$isVisible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  font-size: ${(props) => props.theme.fonts};
  color: ${(props) => props.theme.main};
  background-color: ${(props) => props.theme.secondary};
  outline: none;
  transition: all 0.2s ease;
  animation: ${(props) => (props.$isVisible ? popOut : 'none')} 0.5s ease-out;
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
    border: 2px solid ${(props) => props.theme.secondary};
    border-radius: 50%;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
    transition: all 0.2s ease;
    content: '';
  }

  &:hover::after {
    padding: 0.3rem;
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`

export const Btn = styled.button<{ $isConfirming?: boolean }>`
  position: relative;
  display: inline-block;
  padding: 0.9rem 2.5rem;
  border: none;
  border-radius: 50px;
  font-size: ${(props) => props.theme.fonts};
  color: ${(props) => props.theme.main};
  background-color: ${(props) => (props.$isConfirming ? props.theme.warning : props.theme.secondary)};
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
    border: 2px solid ${(props) => (props.$isConfirming ? props.theme.warning : props.theme.secondary)};
    border-radius: 50px;
    transform: translate(-50%, -50%) scale(0);
    transition: all 0.2s ease;
    content: '';
  }

  &:hover::after {
    padding: 0.3rem;
    transform: translate(-50%, -50%) scale(1);
  }
`
