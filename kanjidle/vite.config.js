import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import obfuscateEntriesPlugin from './obfuscateEntriesPlugin.js'

export default defineConfig(({ command, mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(command === 'build' ? [obfuscateEntriesPlugin()] : []),
  ],
  base: "/kanjidle",
}))
