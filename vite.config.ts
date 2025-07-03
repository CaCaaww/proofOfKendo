import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

//base: '/your-app/',
export default defineConfig({
  plugins: [react()],
  base: './'
});
