import styled from 'styled-components'

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

export const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.fontl};
  font-weight: 800;
  color: ${(props) => props.theme.textPrimary};
`

export const FinanceGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr 1fr;
`

export const Cube = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 9.375rem;
  padding: 1.5rem;
  border-radius: 1.25rem;
  background-color: ${(props) => props.theme.cardBackground};
  box-shadow: 0 0.25rem 0.9375rem rgb(0 0 0 / 5%);
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0.5rem 1.25rem rgb(0 0 0 / 8%);
    transform: translateY(-0.3125rem);
  }
`

export const CubeIcon = styled.div<{ $level?: 'low' | 'medium' | 'high' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 1rem;
  border-radius: 0.625rem;

  svg {
    width: 1.375rem;
    height: 1.375rem;
  }
`

export const CubeContent = styled.div`
  display: flex;
  flex-direction: column;
`

export const CubeLabel = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fonts};
  font-weight: 500;
  color: ${(props) => props.theme.textSecondary};
`

export const CubeValue = styled.p`
  margin: 0.25rem 0 0;
  font-size: ${(props) => props.theme.fontl};
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
`

export const CubeSubValue = styled.p`
  margin: 0.1rem 0 0;
  font-size: ${(props) => props.theme.fonts};
  font-weight: 500;
  color: ${(props) => props.theme.textSecondary};
`
