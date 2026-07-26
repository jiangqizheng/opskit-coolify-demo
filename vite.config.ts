import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools({ consolePiping: { enabled: process.env.PF_RUNTIME_LOG_CAPTURED !== '1' } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
