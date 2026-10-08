/**
 * @module WalletStats
 * Displays financial statistics widgets including balance, gas price, transactions, and network.
 * Presents key wallet metrics in a grid of informational cards.
 */

import { BoltIcon, ClockIcon, SignalIcon, WalletIcon } from '@heroicons/react/24/outline'
import {
  Cube,
  CubeContent,
  CubeIcon,
  CubeLabel,
  CubeSubValue,
  CubeValue,
  FinanceGrid,
  SectionContainer,
  SectionTitle
} from '@presentation/components/dashboard/wallet-stats.styles'
import type { FinanceStats, GasLevel } from '@presentation/view-models/dashboard/wallet-stats.vm'

/**
 * Props for balance widget displaying ETH and USD values.
 */
interface WidgetProps {
  balance: string
  usdValue: string
}

/**
 * Widget displaying wallet balance in ETH with USD conversion.
 */
const BalanceWidget = ({ balance, usdValue }: WidgetProps) => (
  <Cube>
    <CubeIcon>
      <WalletIcon />
    </CubeIcon>
    <CubeContent>
      <CubeLabel>Balance</CubeLabel>
      <CubeValue>{balance} ETH</CubeValue>
      <CubeSubValue>{usdValue}</CubeSubValue>
    </CubeContent>
  </Cube>
)

/**
 * Props for gas price widget displaying current network gas fees.
 */
interface GasWidgetProps {
  gasPrice: string
  level: GasLevel
}

/**
 * Widget displaying current estimated gas price in Gwei with visual level indicator.
 */
const GasPriceWidget = ({ gasPrice, level }: GasWidgetProps) => (
  <Cube title="Gas is the fee required to conduct a transaction on Ethereum.">
    <CubeIcon $level={level}>
      <BoltIcon />
    </CubeIcon>
    <CubeContent>
      <CubeLabel>Current Gas Price (Estimated)</CubeLabel>
      <CubeValue>{gasPrice} Gwei</CubeValue>
    </CubeContent>
  </Cube>
)

/**
 * Props for transaction count widget.
 */
interface TransactionWidgetProps {
  count: string
}

/**
 * Widget displaying count of recent transactions.
 */
const TransactionWidget = ({ count }: TransactionWidgetProps) => (
  <Cube>
    <CubeIcon>
      <ClockIcon />
    </CubeIcon>
    <CubeContent>
      <CubeLabel>Recent Transactions</CubeLabel>
      <CubeValue>{count}</CubeValue>
    </CubeContent>
  </Cube>
)

/**
 * Props for network widget displaying blockchain network name.
 */
interface NetworkWidgetProps {
  name: string
}

/**
 * Widget displaying the current connected blockchain network.
 */
const NetworkWidget = ({ name }: NetworkWidgetProps) => (
  <Cube>
    <CubeIcon>
      <SignalIcon />
    </CubeIcon>
    <CubeContent>
      <CubeLabel>Network</CubeLabel>
      <CubeValue>{name}</CubeValue>
    </CubeContent>
  </Cube>
)

/**
 * Props for WalletStats component.
 */
interface WalletStatsProps {
  stats: FinanceStats
}

/**
 * Container component displaying all financial statistics widgets in a grid layout.
 * Shows balance, gas price, transaction count, and network information.
 */
export const WalletStats = ({ stats }: WalletStatsProps) => {
  return (
    <SectionContainer>
      <SectionTitle>Finance</SectionTitle>
      <FinanceGrid>
        <BalanceWidget balance={stats.balance} usdValue={stats.usdValue} />
        <GasPriceWidget gasPrice={stats.gasPrice} level={stats.gasLevel} />
        <TransactionWidget count={stats.transactionCount} />
        <NetworkWidget name={stats.networkName} />
      </FinanceGrid>
    </SectionContainer>
  )
}
