/**
 * @module WalletDisplay
 * Displays connected wallet address with visibility toggle and connection status.
 * Features an animated background with falling Ethereum logo raindrops.
 */

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CopyToClipboard } from '@presentation/components/common/copy-to-clipboard'
import {
  AddressText,
  CardFooter,
  CardHeader,
  CardNumber,
  CardTitleRow,
  ConnectedStatus,
  ConnectedText,
  HideText,
  Raindrop,
  SectionContainer,
  SectionTitle,
  SliderContainer,
  SliderThumb,
  SliderTrack,
  StatusIcon,
  WALLET_DISPLAY_ANIMATION,
  WalletCard
} from '@presentation/components/dashboard/wallet-display.styles'
import { useMyWalletsViewModel } from '@presentation/view-models/dashboard/wallet-display.vm'
import { useMemo } from 'react'
import { SiEthereum } from 'react-icons/si'

/**
 * Wallet card component showing connected address with copy functionality and hide toggle.
 * Includes animated Ethereum logo background and visual connection status indicator.
 */
export const WalletDisplay = () => {
  const { displayAddress, isConnected, isAddressHidden, toggleAddressVisibility } = useMyWalletsViewModel()
  const raindrops = useMemo(() => {
    return Array.from({ length: WALLET_DISPLAY_ANIMATION.RAINDROP_DENSITY }).map(() => ({
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * (WALLET_DISPLAY_ANIMATION.MAX_DURATION_S - WALLET_DISPLAY_ANIMATION.MIN_DURATION_S) + WALLET_DISPLAY_ANIMATION.MIN_DURATION_S}s`,
      delay: `${Math.random() * WALLET_DISPLAY_ANIMATION.MAX_DURATION_S}s`
    }))
  }, [])
  return (
    <SectionContainer>
      <SectionTitle>My Wallets</SectionTitle>
      <WalletCard $isHidden={isAddressHidden}>
        {raindrops.map((drop, index) => (
          <Raindrop
            key={index}
            style={{
              left: drop.left,
              animationDuration: drop.duration,
              animationDelay: drop.delay
            }}
          >
            <SiEthereum size={24} />
          </Raindrop>
        ))}
        <CardHeader>
          <CardTitleRow>
            <AddressText>ADDRESS</AddressText>
            {isConnected && <CopyToClipboard textToCopy={displayAddress} color="white" />}
          </CardTitleRow>
          <CardNumber $isHidden={isAddressHidden}>{displayAddress}</CardNumber>
        </CardHeader>
        <CardFooter>
          <SliderContainer onClick={toggleAddressVisibility}>
            <HideText>HIDE</HideText>
            <SliderTrack $isActive={isAddressHidden}>
              <SliderThumb $isActive={isAddressHidden} />
            </SliderTrack>
          </SliderContainer>
          <ConnectedStatus $isConnected={isConnected}>
            <ConnectedText>CONNECTED</ConnectedText>
            <StatusIcon $isConnected={isConnected}>
              {isConnected ? <CheckIcon width={24} height={24} /> : <XMarkIcon width={24} height={24} />}
            </StatusIcon>
          </ConnectedStatus>
        </CardFooter>
      </WalletCard>
    </SectionContainer>
  )
}
