import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Esto permite acceso desde cualquier dispositivo en la misma red
    port: 5173, // Cambia este puerto si lo necesitas
  },
})
