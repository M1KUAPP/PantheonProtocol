/**
 * Copy to clipboard button component.
 *
 * Copies text to the clipboard when clicked and shows visual
 * feedback with a checkmark icon on success.
 * @module
 */

import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import { CopyButton, IconWrapper } from '@presentation/components/common/copy-to-clipboard.styles'
import { useServices } from '@presentation/providers/app-provider'
import { useState } from 'react'
import { useTheme } from 'styled-components'

/** Props for the CopyToClipboard component. */
interface CopyToClipboardProps {
  textToCopy: string
  color?: string
}

/** Button that copies text to clipboard with visual feedback. */
export const CopyToClipboard = ({ textToCopy, color }: CopyToClipboardProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const { notification } = useServices()
  const theme = useTheme()
  const handleCopy = async () => {
    if (isCopied) return
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      notification.info('Copied address to clipboard!')
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch {
      notification.error('Failed to copy address.')
    }
  }
  const copyIconColor = color || theme.textSecondary
  const checkmarkIconColor = color || theme.success
  return (
    <CopyButton onClick={handleCopy} title="Copy to clipboard">
      {isCopied ? (
        <IconWrapper $color={checkmarkIconColor}>
          <CheckIcon width={20} height={20} />
        </IconWrapper>
      ) : (
        <IconWrapper $color={copyIconColor}>
          <ClipboardIcon width={20} height={20} />
        </IconWrapper>
      )}
    </CopyButton>
  )
}
