import styled from 'styled-components'

export const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  width: 100%;
  margin-bottom: 2rem;
`

export const PageHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: ${(props) => props.theme.fontxxl};
  font-weight: 800;
  color: ${(props) => props.theme.textPrimary};
`

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 0.0625rem solid ${(props) => props.theme.borderLight};
  border-radius: 0.625rem;
  background-color: ${(props) => props.theme.cardBackground};
  box-shadow: 0 0.25rem 0.375rem rgb(0 0 0 / 4%);
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  svg {
    stroke: ${(props) => props.theme.sidebarIcon};
  }

  &:hover {
    box-shadow: 0 0.375rem 0.75rem rgb(0 0 0 / 8%);
    transform: translateY(-0.125rem);
  }
`

export const ProfileImageContainer = styled(IconButton)`
  padding: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
