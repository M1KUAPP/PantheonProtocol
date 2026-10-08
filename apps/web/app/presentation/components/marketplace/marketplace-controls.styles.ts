import styled from 'styled-components'

export const ControlBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding-bottom: 2rem;
`

export const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.5rem;
  font-size: ${(props) => props.theme.fontm};
  color: ${(props) => props.theme.secondary};
  background-color: ${(props) => props.theme.main};
  outline: none;

  &:focus {
    border-color: ${(props) => props.theme.buttonPrimary};
  }
`

export const FilterSelect = styled.select`
  min-width: 10rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.5rem;
  font-size: ${(props) => props.theme.fontm};
  color: ${(props) => props.theme.textPrimary};
  background-color: ${(props) => props.theme.main};
  cursor: pointer;
  appearance: none;
`
