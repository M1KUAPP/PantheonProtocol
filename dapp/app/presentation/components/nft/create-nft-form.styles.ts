import styled from 'styled-components'

export const Section = styled.section`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.background};
  overflow-y: auto;
  inset: 6rem 0 0;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 50rem;
  margin: auto;
  box-sizing: border-box;
`

export const FormContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 50rem;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 3.125rem;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.main};
  box-shadow: 0 0 0.625rem rgba(${(props) => props.theme.secondaryRgba}, 20%);
  transition: all 0.2s ease;

  &:focus-within {
    box-shadow: 0 0 0.9375rem rgba(${(props) => props.theme.secondaryRgba}, 50%);
  }
`

export const TextField = styled.input`
  flex: 1;
  padding: 0.5rem 1.5rem;
  border: none;
  font-size: ${(props) => props.theme.fontm};
  color: ${(props) => props.theme.secondary};
  background-color: ${(props) => props.theme.main};
  outline: none;

  &::placeholder {
    color: rgba(${(props) => props.theme.secondaryRgba}, 20%);
  }
`
