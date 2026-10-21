import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Separa las librerías pesadas del código de la app para mejorar el caché.
        codeSplitting: {
          groups: [
            {
              name: (id: string) =>
                id.includes('@mui') || id.includes('@emotion') ? 'mui' : null,
            },
            {
              name: (id: string) =>
                id.includes('@dnd-kit') ? 'dnd-kit' : null,
            },
            {
              name: (id: string) =>
                id.includes('node_modules/react') ||
                id.includes('node_modules/scheduler') ||
                id.includes('react-router')
                  ? 'react'
                  : null,
            },
          ],
        },
      },
    },
  },
})
