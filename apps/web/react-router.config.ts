import type { Config } from '@react-router/dev/config'

export default {
  // SPA mode: styled-components isn't set up for server rendering.
  ssr: false
} satisfies Config
