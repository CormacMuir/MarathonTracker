import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Melbourne Marathon Training',
      short_name: 'MarathonPlan',
      start_url: '/',
      display: 'standalone',
      background_color: '#111827',
      theme_color: '#1f2937',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    }
  })
  ],
  base: '/', // Replace with your actual repo name
})