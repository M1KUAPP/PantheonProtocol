/**
 * @module TransactionHistoryModal
 * Full-screen modal displaying complete transaction history without pagination.
 * Allows users to view and scroll through all transactions in a single view.
 */

import { XMarkIcon } from '@heroicons/react/24/outline'
import { CustomBackdrop } from '@presentation/components/common/backdrop'
import {
  CloseButton,
  ModalContent,
  ModalHeader,
  ModalTableHeader,
  ModalTitle,
  ScrollableContent
} from '@presentation/components/dashboard/transaction-history-modal.styles'
import {
  DateCell,
  RecipientCell,
  StatusBadge,
  TableRow,
  TimeSubtext
} from '@presentation/components/dashboard/transaction-history.styles'

/**
 * Transaction data structure for modal display.
 */
interface Transaction {
  recipient: string
  subtext: string
  date: string
  time: string
  status: string
  amount: string
}

/**
 * Props for TransactionHistoryModal component.
 */
interface ModalProps {
  show: boolean
  onClose: () => void
  transactions: Transaction[]
}

/**
 * Expanded modal view showing all transactions in a scrollable list.
 * Displays when user clicks the expand button in the transaction history table.
 */
export const TransactionHistoryModal = ({ show, onClose, transactions }: ModalProps) => {
  if (!show) {
    return null
  }
  return (
    <CustomBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader $withTitle={true}>
          <ModalTitle>Transaction History</ModalTitle>
          <CloseButton onClick={onClose}>
            <XMarkIcon />
          </CloseButton>
        </ModalHeader>
        <ModalTableHeader>
          <span>Recipient</span>
          <span>Date</span>
          <span>Status</span>
          <span>Amount</span>
        </ModalTableHeader>
        <ScrollableContent>
          {transactions.map((tx, index) => (
            <TableRow key={index}>
              <RecipientCell>
                <h4>{tx.recipient}</h4>
                <p>{tx.subtext}</p>
              </RecipientCell>
              <DateCell>
                <span>{tx.date}</span>
                <TimeSubtext>{tx.time}</TimeSubtext>
              </DateCell>
              <StatusBadge $status={tx.status as 'Success' | 'Pending' | 'Failed'}>{tx.status}</StatusBadge>
              <span>{tx.amount}</span>
            </TableRow>
          ))}
        </ScrollableContent>
      </ModalContent>
    </CustomBackdrop>
  )
}
