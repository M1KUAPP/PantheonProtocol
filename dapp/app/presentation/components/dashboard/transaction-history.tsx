/**
 * @module TransactionHistory
 * Displays paginated transaction history with status badges and detailed information.
 * Provides expand-to-modal functionality for viewing full transaction list.
 */

import { ArrowsPointingOutIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { TransactionHistoryModal } from '@presentation/components/dashboard/transaction-history-modal'
import {
  DateCell,
  ExpandButton,
  NavButton,
  NoTransactionsText,
  PageNumber,
  PaginationControls,
  RecipientCell,
  SectionContainer,
  SectionTitle,
  StatusBadge,
  TableContainer,
  TableHeader,
  TableRow,
  TimeSubtext,
  UtilityBar
} from '@presentation/components/dashboard/transaction-history.styles'
import { LoadingContainer, LoadingSpinner, LoadingText } from '@presentation/components/ui/shared.styles'
import { useTransactionHistoryViewModel } from '@presentation/view-models/dashboard/transaction-history.vm'

/**
 * Transaction history table with pagination controls and modal expansion.
 * Shows recipient, date, status, and amount for each transaction with loading and empty states.
 */
export const TransactionHistory = () => {
  const {
    transactions,
    isLoading,
    currentPage,
    totalPages,
    paginatedData,
    isModalOpen,
    nextPage,
    prevPage,
    openModal,
    closeModal
  } = useTransactionHistoryViewModel()
  if (isLoading) {
    return (
      <SectionContainer>
        <SectionTitle>Transaction History</SectionTitle>
        <TableContainer>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading transactions...</LoadingText>
          </LoadingContainer>
        </TableContainer>
      </SectionContainer>
    )
  }
  return (
    <>
      <SectionContainer>
        <SectionTitle>Transaction History</SectionTitle>
        <TableContainer>
          <TableHeader>
            <span>Recipient</span>
            <span>Date</span>
            <span>Status</span>
            <span>Amount</span>
          </TableHeader>
          {transactions.length === 0 ? (
            <NoTransactionsText>None</NoTransactionsText>
          ) : (
            paginatedData.map((tx, index) => (
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
            ))
          )}
          {transactions.length > 0 && (
            <UtilityBar>
              <ExpandButton onClick={openModal}>
                <ArrowsPointingOutIcon width={20} height={20} />
              </ExpandButton>
              <PaginationControls>
                <NavButton onClick={prevPage} disabled={currentPage === 1}>
                  <ChevronUpIcon width={25} height={25} />
                </NavButton>
                <PageNumber>
                  {currentPage} / {totalPages}
                </PageNumber>
                <NavButton onClick={nextPage} disabled={currentPage === totalPages}>
                  <ChevronUpIcon width={25} height={25} style={{ transform: 'rotate(180deg)' }} />
                </NavButton>
              </PaginationControls>
            </UtilityBar>
          )}
        </TableContainer>
      </SectionContainer>
      <TransactionHistoryModal show={isModalOpen} onClose={closeModal} transactions={transactions} />
    </>
  )
}
