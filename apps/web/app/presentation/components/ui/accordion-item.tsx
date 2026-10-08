/**
 * Collapsible accordion item component.
 *
 * Displays a title that can be clicked to expand/collapse
 * the associated content with plus/minus indicators.
 * @module
 */

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Container, Indicator, SubText, Title, TitleContainer } from '@presentation/components/ui/accordion-item.styles'
import { useState } from 'react'

/** Props for the AccordionItem component. */
interface QuestionProps {
  title: string
  subText: string
}

/** Expandable accordion item with title and collapsible content. */
export const AccordionItem = ({ title, subText }: QuestionProps) => {
  const [collapse, setCollapse] = useState(false)
  return (
    <Container>
      <TitleContainer onClick={() => setCollapse(!collapse)}>
        <Title>
          <span>{title}</span>
        </Title>
        {collapse ? (
          <Indicator>
            <MinusIcon />
          </Indicator>
        ) : (
          <Indicator>
            <PlusIcon />
          </Indicator>
        )}
      </TitleContainer>
      <SubText $clicked={collapse}>{subText}</SubText>
    </Container>
  )
}
