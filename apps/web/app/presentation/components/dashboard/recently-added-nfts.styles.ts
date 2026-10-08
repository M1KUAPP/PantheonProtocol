import { Link } from 'react-router'
import styled from 'styled-components'

const NFT_CARD_HEIGHT = '23.5rem'

export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const ErrorMessage = styled.div`
  padding: 1rem;
  text-align: center;
  color: ${(props) => props.theme.error};
`

export const SectionTitle = styled.h2`
  margin-bottom: 0.5rem;
  font-size: ${(props) => props.theme.fontl};
  font-weight: 800;
  color: ${(props) => props.theme.textPrimary};
`

export const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  padding-bottom: 1rem;
  border-radius: 1.25rem;
  background-color: ${(props) => props.theme.cardBackground};
  box-shadow: 0 0.125rem 0.625rem rgb(0 0 0 / 5%);
`

export const EmblaViewport = styled.div`
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  overflow: hidden;
`

export const EmblaContainer = styled.div`
  display: flex;
  margin-left: -1rem;
`

export const EmblaSlide = styled.div`
  flex: 0 0 30.5%;
  min-width: 0;
  padding-left: 1.3rem;
`

export const NFTCard = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: ${NFT_CARD_HEIGHT};
  border: 1px solid ${(props) => props.theme.borderLight};
  border-radius: 0.9375rem;
  text-decoration: none;
  background-color: ${(props) => props.theme.main};
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 8px rgb(0 0 0 / 15%);
    transform: translateY(-0.25rem);
  }

  &:active {
    transform: scale(0.98);
  }

  &:hover img {
    transform: scale(1.05);
  }
`

export const NFTImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  min-height: ${NFT_CARD_HEIGHT};
  transition: transform 0.3s ease-in-out;
  object-fit: cover;
`

export const CardDetails = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(to top, rgb(0 0 0 / 80%) 0%, rgb(0 0 0 / 60%) 50%, transparent 100%);

  h3 {
    margin: 0 0 0.25rem;
    font-size: ${(props) => props.theme.fontm};
    font-weight: 600;
    white-space: nowrap;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 0;
    font-size: ${(props) => props.theme.fontxs};
    color: rgb(255 255 255 / 85%);
  }
`

export const AddNFTCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  min-height: ${NFT_CARD_HEIGHT};
  border: 2px dashed ${(props) => props.theme.border};
  border-radius: 0.9375rem;
  background-color: ${(props) => props.theme.background};
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
  transition: all 0.2s ease-in-out;

  svg {
    color: ${(props) => props.theme.textPrimary};
  }

  &:hover {
    border-color: ${(props) => props.theme.textSecondary};
    box-shadow: 0 4px 8px rgb(0 0 0 / 15%);
    transform: translateY(-0.25rem);
  }
`

export const AddNFTLink = styled(Link)`
  position: relative;
  font-size: ${(props) => props.theme.fontm};
  font-weight: 600;
  text-decoration: none;
  color: ${(props) => props.theme.textPrimary};
  transition: color 0.2s ease-in-out;

  &::after {
    position: absolute;
    bottom: -0.25rem;
    left: 0;
    width: 0;
    height: 0.125rem;
    background-color: ${(props) => props.theme.textPrimary};
    transition: width 0.3s ease-in-out;
    content: '';
  }

  &:hover {
    color: ${(props) => props.theme.secondary};

    &::after {
      width: 100%;
      background-color: ${(props) => props.theme.secondary};
    }
  }
`

export const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0;
`

export const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`

export const DotButton = styled.button<{ $isSelected: boolean }>`
  width: 0.75rem;
  height: 0.75rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: ${(props) => (props.$isSelected ? props.theme.textPrimary : props.theme.border)};
  transition: background-color 0.2s ease;
  cursor: pointer;
`

export const EmblaButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3.6rem;
  height: 3.6rem;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: ${({ theme }) => theme.textPrimary};
  background-color: transparent;
  box-shadow: inset 0 0 0 0.2rem ${({ theme }) => theme.border};
  cursor: pointer;
  appearance: none;
  touch-action: manipulation;

  &:disabled {
    color: ${({ theme }) => theme.textSecondary};
  }

  .embla__button__svg {
    width: 35%;
    height: 35%;
  }
`
