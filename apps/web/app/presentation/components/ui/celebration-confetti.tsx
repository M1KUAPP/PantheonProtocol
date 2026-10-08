/**
 * Celebration confetti animation component.
 *
 * Displays falling diamond-shaped confetti across the screen
 * for celebratory moments like successful transactions.
 * @module
 */

import ReactConfetti from 'react-confetti'
import { useWindowSize } from 'react-use'

/** Number of confetti pieces to render. */
const CONFETTI_PIECE_COUNT = 100

/** Opacity of the confetti particles. */
const CONFETTI_OPACITY = 0.5

/** Scale factor for diamond shapes. */
const DIAMOND_SCALE = 2.5

/** Coordinate points defining the diamond shape. */
const DIAMOND_SHAPE = {
  TOP: { x: 0, y: -10 },
  LEFT: { x: -7, y: 2 },
  RIGHT: { x: 7, y: 2 },
  MIDDLE: { x: 0, y: 6 },
  BOTTOM_LEFT: { x: -7, y: 4 },
  BOTTOM_RIGHT: { x: 7, y: 4 },
  BOTTOM_CENTER: { x: 0, y: 8 },
  BOTTOM_TIP: { x: 0, y: 18 }
} as const

/**
 * Draws a diamond shape on the canvas context.
 * @param ctx - The canvas rendering context.
 */
const drawDiamond = (ctx: CanvasRenderingContext2D): void => {
  ctx.beginPath()
  ctx.moveTo(DIAMOND_SHAPE.TOP.x * DIAMOND_SCALE, DIAMOND_SHAPE.TOP.y * DIAMOND_SCALE)
  ctx.lineTo(DIAMOND_SHAPE.LEFT.x * DIAMOND_SCALE, DIAMOND_SHAPE.LEFT.y * DIAMOND_SCALE)
  ctx.lineTo(DIAMOND_SHAPE.MIDDLE.x * DIAMOND_SCALE, DIAMOND_SHAPE.MIDDLE.y * DIAMOND_SCALE)
  ctx.lineTo(DIAMOND_SHAPE.RIGHT.x * DIAMOND_SCALE, DIAMOND_SHAPE.RIGHT.y * DIAMOND_SCALE)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(DIAMOND_SHAPE.BOTTOM_LEFT.x * DIAMOND_SCALE, DIAMOND_SHAPE.BOTTOM_LEFT.y * DIAMOND_SCALE)
  ctx.lineTo(DIAMOND_SHAPE.BOTTOM_CENTER.x * DIAMOND_SCALE, DIAMOND_SHAPE.BOTTOM_CENTER.y * DIAMOND_SCALE)
  ctx.lineTo(DIAMOND_SHAPE.BOTTOM_RIGHT.x * DIAMOND_SCALE, DIAMOND_SHAPE.BOTTOM_RIGHT.y * DIAMOND_SCALE)
  ctx.lineTo(DIAMOND_SHAPE.BOTTOM_TIP.x * DIAMOND_SCALE, DIAMOND_SHAPE.BOTTOM_TIP.y * DIAMOND_SCALE)
  ctx.closePath()
  ctx.fill()
}

/** Full-screen celebration confetti animation with diamond shapes. */
export const CelebrationConfetti = () => {
  const { width, height } = useWindowSize()
  return (
    <ReactConfetti
      width={width}
      height={height}
      numberOfPieces={CONFETTI_PIECE_COUNT}
      opacity={CONFETTI_OPACITY}
      drawShape={drawDiamond}
    />
  )
}
