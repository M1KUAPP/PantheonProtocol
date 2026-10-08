import styled from 'styled-components'

export const DashboardGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 2fr 1fr;
  padding-bottom: 2rem;
  box-sizing: border-box;
`

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-sizing: border-box;
`

export const SideContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
`
