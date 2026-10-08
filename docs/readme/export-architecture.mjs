#!/usr/bin/env node
/**
 * Exports the README architecture diagram, tinted with PantheonProtocol's theme tokens.
 *
 * Archify (https://github.com/tt-a1i/archify) renders architecture.json into a standalone HTML viewer. This script
 * delivers a temporary copy of architecture.json (with the meta.output path that `deliver` needs), checks it, restyles
 * the viewer with apps/web/app/presentation/styles/theme-definitions.ts tokens and the system font stack, and saves the
 * viewer's own SVG export once per color scheme. Archify's SVG export follows prefers-color-scheme, but a README
 * <picture> picks the file by GitHub's theme, so each file is locked to its scheme with the export's svg[data-theme]
 * rules.
 *
 * Re-run, from the repository root:
 *   node docs/readme/export-architecture.mjs <archify>/bin/archify.mjs
 *
 * Inputs: architecture.json beside this file, and the path to archify's CLI (the diagram was built with archify 3.0,
 * and passes `finalize` at the showcase quality profile).
 *
 * Needs Playwright. Either install it without saving (`bun add --no-save playwright`) or point PLAYWRIGHT at an
 * installed playwright or playwright-core package directory. It drives the installed Google Chrome, or Playwright's
 * Chromium when Chrome is missing (`bunx playwright install chromium`, once).
 *
 * Writes: architecture-light.svg and architecture-dark.svg beside this file, with trailing whitespace trimmed and a
 * final newline, as .editorconfig asks.
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const README_DIR = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT ?? 'playwright')

// Archify's theme variables mapped to theme-definitions.ts tokens: background, cards, borders and text to their
// namesakes, emphasis and the frontend to accent1, the backend to accent2, databases to gradient2, cloud to accent3
// (light) or gradient1 (dark), security to error, the message bus to success, and external to textTertiary.
const THEMES = {
  light: {
    '--bg': '#F4F7FD', // background
    '--mask': '#F4F7FD', // background
    '--grid': '#F0F0F0', // borderLight
    '--canvas-dot': '#E0E0E0', // border
    '--panel': '#FFFFFF', // cardBackground
    '--panel-border': '#E0E0E0', // border
    '--text': '#333333', // textPrimary
    '--text-muted': '#555555', // textTertiary
    '--text-dim': '#888888', // textSecondary
    '--text-faint': '#555555', // textTertiary
    '--lane-fill': '#F0F0F0', // borderLight
    '--lane-stroke': '#888888', // textSecondary
    '--arrow': '#888888', // textSecondary
    '--arrow-emphasis': '#00ADB5', // accent1
    '--frontend-fill': 'rgba(0, 173, 181, 0.1)', // accent1
    '--frontend-stroke': '#00ADB5', // accent1
    '--backend-fill': 'rgba(63, 114, 175, 0.1)', // accent2
    '--backend-stroke': '#3F72AF', // accent2
    '--database-fill': 'rgba(162, 89, 255, 0.08)', // gradient2
    '--database-stroke': '#A259FF', // gradient2
    '--cloud-fill': 'rgba(255, 148, 148, 0.12)', // accent3
    '--cloud-stroke': '#FF9494', // accent3
    '--security-fill': 'rgba(239, 68, 68, 0.08)', // error
    '--security-stroke': '#EF4444', // error
    '--messagebus-fill': 'rgba(34, 197, 94, 0.1)', // success
    '--messagebus-stroke': '#22C55E', // success
    '--external-fill': '#FFFFFF', // cardBackground
    '--external-stroke': '#555555' // textTertiary
  },
  dark: {
    '--bg': '#1A1A1A', // background
    '--mask': '#1A1A1A', // background
    '--grid': '#353535', // borderLight
    '--canvas-dot': '#353535', // borderLight
    '--panel': '#2A2A2A', // cardBackground
    '--panel-border': '#404040', // border
    '--text': '#E0E0E0', // textPrimary
    '--text-muted': '#B0B0B0', // textTertiary
    '--text-dim': '#A0A0A0', // textSecondary
    '--text-faint': '#B0B0B0', // textTertiary
    '--lane-fill': '#202020', // main
    '--lane-stroke': '#A0A0A0', // textSecondary
    '--arrow': '#A0A0A0', // textSecondary
    '--arrow-emphasis': '#FF7738', // accent1
    '--frontend-fill': 'rgba(255, 119, 56, 0.14)', // accent1
    '--frontend-stroke': '#FF7738', // accent1
    '--backend-fill': 'rgba(226, 150, 56, 0.14)', // accent2
    '--backend-stroke': '#E29638', // accent2
    '--database-fill': 'rgba(162, 89, 255, 0.16)', // gradient2
    '--database-stroke': '#A259FF', // gradient2
    '--cloud-fill': 'rgba(63, 114, 175, 0.18)', // gradient1
    '--cloud-stroke': '#3F72AF', // gradient1
    '--security-fill': 'rgba(239, 68, 68, 0.14)', // error
    '--security-stroke': '#EF4444', // error
    '--messagebus-fill': 'rgba(34, 197, 94, 0.14)', // success
    '--messagebus-stroke': '#22C55E', // success
    '--external-fill': '#2A2A2A', // cardBackground
    '--external-stroke': '#B0B0B0' // textTertiary
  }
}

const FONT = "Manrope, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const declarations = (vars) =>
  Object.entries(vars)
    .map(([name, value]) => `${name}: ${value};`)
    .join(' ')

const tokenCss = [
  `:root, [data-theme="dark"] { ${declarations(THEMES.dark)} }`,
  `[data-theme="light"] { ${declarations(THEMES.light)} }`,
  `svg, svg text { font-family: ${FONT}; }`
].join('\n')

function restyle(html) {
  // Archify's export copies the #archify-fonts element's text into the SVG; empty it so the SVG embeds no font.
  const fonts = /(<style id="archify-fonts">)[\s\S]*?(<\/style>)/
  if (!fonts.test(html)) throw new Error('No #archify-fonts style element: is this an Archify HTML file?')
  return html.replace(fonts, '$1$2').replace('</head>', `<style id="pantheon-tokens">\n${tokenCss}\n</style>\n</head>`)
}

async function launch() {
  try {
    return await chromium.launch({ channel: 'chrome' })
  } catch {
    return await chromium.launch()
  }
}

async function exportSvg(browser, pageUrl, scheme) {
  const context = await browser.newContext({
    colorScheme: scheme,
    acceptDownloads: true,
    viewport: { width: 1440, height: 900 }
  })
  const page = await context.newPage()
  await page.goto(pageUrl)
  await page.evaluate(() => document.fonts.ready)
  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
  if (theme !== scheme) throw new Error(`Viewer opened in ${theme} theme, expected ${scheme}`)
  await page.click('#btn-export')
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#export-menu [data-format="svg"]')])
  const svg = fs.readFileSync(await download.path(), 'utf8')
  await context.close()
  if (!/^(<\?xml[^>]*>\s*)?<svg /.test(svg) || /<svg [^>]*data-theme=/.test(svg)) throw new Error('Unexpected SVG root')
  return tidy(svg.replace('<svg ', `<svg data-theme="${scheme}" `))
}

// Archify's export leaves trailing spaces in its CSS and no final newline; .editorconfig allows neither.
function tidy(text) {
  return text.replace(/[ \t]+$/gm, '').replace(/\n*$/, '\n')
}

const archify = process.argv[2]
if (!archify || !fs.existsSync(archify)) {
  console.error('Usage: node docs/readme/export-architecture.mjs <archify>/bin/archify.mjs')
  process.exit(2)
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pantheon-architecture-'))
try {
  const source = JSON.parse(fs.readFileSync(path.join(README_DIR, 'architecture.json'), 'utf8'))
  source.meta.output = 'architecture.html'
  const input = path.join(workDir, 'architecture.json')
  const delivered = path.join(workDir, 'architecture.html')
  fs.writeFileSync(input, JSON.stringify(source, null, 2))
  execFileSync(
    'node',
    [archify, 'deliver', 'architecture', input, delivered, '--quality', source.meta.quality_profile],
    {
      stdio: 'inherit'
    }
  )
  execFileSync('node', [archify, 'check', delivered, '--require-provenance'], { stdio: 'ignore' })

  const styled = path.join(workDir, 'styled.html')
  fs.writeFileSync(styled, restyle(fs.readFileSync(delivered, 'utf8')))
  const browser = await launch()
  try {
    for (const scheme of ['light', 'dark']) {
      const outFile = path.join(README_DIR, `architecture-${scheme}.svg`)
      fs.writeFileSync(outFile, await exportSvg(browser, pathToFileURL(styled).href, scheme))
      console.log(`wrote ${path.relative(process.cwd(), outFile)}`)
    }
  } finally {
    await browser.close()
  }
} finally {
  fs.rmSync(workDir, { recursive: true, force: true })
}
