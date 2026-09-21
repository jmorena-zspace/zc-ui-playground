import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const src = (...segments: string[]) =>
  path.resolve(import.meta.dirname, 'src', ...segments)

/**
 * The components under src/components came from the zCentral app and import
 * through its aliases. Anything the playground cannot install (private
 * @zcentral-v2 packages, app hooks/stores/services that talk to a backend)
 * is pointed at a local stand-in under src/stubs instead, which keeps the
 * component files themselves byte-identical to the source project.
 *
 * Kept in sync by hand with the `paths` in tsconfig.app.json.
 */
const alias = {
  '@': src(),
  '@components': src('components'),
  '@fixtures': src('fixtures'),
  '@pages': src('pages'),
  // Stand-ins — see the README's "Porting components" section.
  '@assets': src('stubs/assets'),
  '@constants': src('stubs/constants'),
  '@hooks': src('stubs/hooks'),
  '@services': src('stubs/services'),
  '@shared': src('stubs/shared'),
  '@stores': src('stubs/stores'),
  '@zcentral-v2/constants': src('stubs/zcentral-v2/constants'),
  '@zcentral-v2/i18n': src('stubs/zcentral-v2/i18n'),
  '@zcentral-v2/search': src('stubs/zcentral-v2/search'),
  '@zcentral-v2/types': src('stubs/zcentral-v2/types'),
  '@zcentral-v2/utils': src('stubs/zcentral-v2/utils'),
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias },
})
