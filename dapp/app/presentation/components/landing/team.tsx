/**
 * @module Team
 * Team section component showcasing team members with generated avatars.
 * Displays team member profiles with auto-generated avatars and celebration confetti effect.
 */

import {
  Container,
  ImageContainer,
  MemberContainer,
  Name,
  Position,
  Section,
  Title
} from '@presentation/components/landing/team.styles'
import { CelebrationConfetti } from '@presentation/components/ui/celebration-confetti'
import Avatar from 'boring-avatars'

const MEMBER_NAMES = [
  'Team Member',
  'Team Member',
  'Team Member',
  'Team Member',
  'Claude Code',
  'Codex',
  'Copilot',
  'Antigravity'
]

const POSITION = [
  'Developer',
  'Developer',
  'Developer',
  'Developer',
  'Assistant',
  'Assistant',
  'Assistant',
  'Assistant'
]

const AVATAR_COLORS = ['#08D9D6', '#252A34', '#FF2E63', '#EAEAEA']

/**
 * Props for individual team member display cards.
 */
interface MemberItemProps {
  name: string
  position?: string
}

const MemberItem = ({ name, position = '' }: MemberItemProps) => {
  return (
    <MemberContainer>
      <ImageContainer>
        <Avatar size={200} name={name} variant="beam" colors={AVATAR_COLORS} />
      </ImageContainer>
      <Name>{name}</Name>
      <Position>{position}</Position>
    </MemberContainer>
  )
}

/**
 * Team section component displaying all team members with generated avatars and confetti animation.
 * Uses boring-avatars library to generate unique, deterministic avatars for each team member.
 */
export const Team = () => {
  return (
    <Section id="team">
      <CelebrationConfetti />
      <Title>Teams</Title>
      <Container>
        {MEMBER_NAMES.map((name, index) => (
          <MemberItem key={index} name={name} position={POSITION[index]} />
        ))}
      </Container>
    </Section>
  )
}
