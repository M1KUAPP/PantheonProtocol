import styled from 'styled-components'

export {
  ConnectPrompt,
  ConnectPromptText,
  EmptyStateIcon,
  LoadingSpinner,
  LoadingText
} from '@presentation/components/ui/shared.styles'

export const LayoutContainer = styled.div`
  position: relative;
  height: 100vh;
  background-color: ${(props) => props.theme.background};
`

export const MainContentWrapper = styled.main<{ $isBlurred?: boolean }>`
  height: 100vh;
  padding: 2rem 3rem;
  padding-left: calc(${(props) => props.theme.sidebarWidth} + 3.5rem);
  box-sizing: border-box;
  transition:
    filter 0.3s ease-in-out,
    transform 0.3s ease-in-out;
  overflow: hidden auto;
  pointer-events: ${(props) => (props.$isBlurred ? 'none' : 'auto')};
  filter: ${(props) => (props.$isBlurred ? 'blur(12px)' : 'none')};

  & > * {
    box-sizing: border-box;
  }
`

export const PageLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  height: 40%;
`
