/**
 * One-off codemod: replace the private FontAwesome Pro kit with lucide-react.
 *
 * Handles the shapes the vendored components actually use — `<FontAwesomeIcon
 * icon={faX} className="..."/>` in JSX, `IconDefinition` in types, and icons
 * passed as props — then reports anything it could not rewrite so it can be
 * finished by hand.
 *
 * Usage: node scripts/fa-to-lucide.mjs <file>...
 */
import { readFileSync, writeFileSync } from 'node:fs'

const MAP = {
  faArrowRight: 'ArrowRight', faArrowRotateLeft: 'RotateCcw', faArrowUp: 'ArrowUp',
  faArrowUpArrowDown: 'ArrowUpDown', faArrowUpRightFromSquare: 'ExternalLink',
  faArrowsRotate: 'RefreshCw', faBook: 'BookOpen', faBookRegular: 'BookOpen',
  faCheck: 'Check', faChevronDown: 'ChevronDown', faChevronLeft: 'ChevronLeft',
  faChevronRight: 'ChevronRight', faChevronUp: 'ChevronUp', faCircleCheck: 'CircleCheck',
  faCircleQuestion: 'CircleHelp', faCircleXmark: 'CircleX', faCog: 'Settings',
  faDownload: 'Download', faExternalLink: 'ExternalLink', faFilter: 'SlidersHorizontal',
  faGlobe: 'Globe', faHome: 'House', faHomeRegular: 'House', faKeyboard: 'Keyboard',
  faLaptop: 'Laptop', faMagnifyingGlass: 'Search', faPlugCircleXmark: 'Unplug',
  faRefresh: 'RefreshCw', faRocket: 'Rocket', faSearch: 'Search',
  faTriangleExclamation: 'TriangleAlert', faXmark: 'X',
}

let failures = []

for (const file of process.argv.slice(2)) {
  let src = readFileSync(file, 'utf8')
  const before = src
  const needed = new Set()

  // Drop the kit + wrapper imports, remembering which icons were pulled in.
  src = src.replace(
    /^import\s*\{([^}]*)\}\s*from\s*'@awesome\.me\/kit-[^']*';\n/gms,
    (_, names) => {
      for (const raw of names.split(',')) {
        const name = raw.trim().split(/\s+as\s+/)[0].trim()
        if (name && MAP[name]) needed.add(MAP[name])
        else if (name) failures.push(`${file}: no lucide mapping for ${name}`)
      }
      return ''
    }
  )
  src = src.replace(/^import\s*\{\s*FontAwesomeIcon\s*\}\s*from\s*'@fortawesome\/react-fontawesome';\n/gm, '')
  const usesIconType = /IconDefinition/.test(src)
  src = src.replace(/^import\s*(?:type\s*)?\{\s*IconDefinition\s*\}\s*from\s*'@fortawesome\/fontawesome-svg-core';\n/gm, '')

  // <FontAwesomeIcon icon={faX} ...props /> -> <LucideName ...props />
  src = src.replace(
    /<FontAwesomeIcon\s+([^>]*?)\/>/gms,
    (whole, attrs) => {
      const iconMatch = attrs.match(/icon=\{([A-Za-z0-9_.]+)\}/)
      if (!iconMatch) { failures.push(`${file}: FontAwesomeIcon without a literal icon prop`); return whole }
      const raw = iconMatch[1]
      const rest = attrs.replace(/icon=\{[A-Za-z0-9_.]+\}\s*/, '').trim()
      if (MAP[raw]) { needed.add(MAP[raw]); return `<${MAP[raw]} ${rest} />`.replace(/\s+\/>/, ' />') }
      // icon came from a prop or local variable: render it as a component
      return `<${raw.charAt(0).toUpperCase() + raw.slice(1)} ${rest} />`.replace(/\s+\/>/, ' />')
    }
  )

  if (usesIconType) {
    src = src.replace(/\bIconDefinition\b/g, 'LucideIcon')
    needed.add('type LucideIcon')
  }
  // Bare references left in defaults / config objects
  for (const [fa, lucide] of Object.entries(MAP)) {
    src = src.replace(new RegExp(`\\b${fa}\\b`, 'g'), (m, offset) => {
      const line = src.slice(src.lastIndexOf('\n', offset), src.indexOf('\n', offset))
      if (line.includes('import ')) return m
      needed.add(lucide)
      return lucide
    })
  }

  if (needed.size) {
    const names = [...needed].sort((a, b) => a.replace('type ', '').localeCompare(b.replace('type ', '')))
    const importLine = `import { ${names.join(', ')} } from 'lucide-react';\n`
    // Put it where the first import is, so ordering stays tidy.
    src = src.replace(/^(import .*\n)/m, importLine + '$1')
  }

  if (src !== before) { writeFileSync(file, src); console.log('rewrote', file) }
}

if (failures.length) {
  console.log('\nNEEDS HAND FINISHING:')
  for (const f of failures) console.log('  ' + f)
}
