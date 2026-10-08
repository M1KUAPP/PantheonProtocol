import styled, { css } from 'styled-components'

const inputBaseStyles = css`
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  font-size: ${(props) => props.theme.fonts};
  color: ${(props) => props.theme.secondary};
  background-color: ${(props) => props.theme.main};
  outline: none;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: rgba(${(props) => props.theme.secondaryRgba}, 40%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const TextInput = styled.input<{ $variant?: 'bordered' | 'minimal' }>`
  ${inputBaseStyles}
  flex: 1;
  border: ${(props) => (props.$variant === 'minimal' ? 'none' : `2px solid rgba(${props.theme.secondaryRgba}, 10%)`)};

  &:focus {
    border-color: ${(props) => (props.$variant === 'minimal' ? 'transparent' : props.theme.secondary)};
  }
`
