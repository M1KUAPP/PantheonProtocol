import styled from 'styled-components'

export {
  ConnectPrompt,
  ConnectPromptText,
  EmptyStateContainer as EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateTitle,
  LoadingContainer,
  LoadingSpinner,
  LoadingText
} from '@presentation/components/ui/shared.styles'

export const Section = styled.section`
  position: relative;
  width: 100%;
  max-width: 100%;
  padding-top: 0;
  padding-bottom: 2rem;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.background};
  overflow-x: hidden;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 87.5rem;
  margin: 0 auto;
  box-sizing: border-box;
`

export const StatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`

export const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: 0.0625rem solid rgba(${(props) => props.theme.secondaryRgba}, 10%);
  border-radius: 0.9375rem;
  background-color: rgba(${(props) => props.theme.secondaryRgba}, 5%);
`

export const StatValue = styled.div`
  font-size: ${(props) => props.theme.fontxl};
  font-weight: 700;
  color: ${(props) => props.theme.secondary};
`

export const StatLabel = styled.div`
  font-size: ${(props) => props.theme.fonts};
  letter-spacing: 0.03rem;
  text-transform: uppercase;
  color: rgba(${(props) => props.theme.secondaryRgba}, 60%);
`

export const GridContainer = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr));
  width: 100%;
  padding: 1rem 0 2rem;
  box-sizing: border-box;
`
