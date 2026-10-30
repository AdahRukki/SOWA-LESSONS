import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({plugins:[react(),VitePWA({registerType:'autoUpdate',manifest:{name:'SOWA Lessons',short_name:'SOWA Lessons',start_url:'/',display:'standalone',background_color:'#fbf8f0',theme_color:'#0870b5',icons:[]},workbox:{navigateFallback:'/index.html'}})]});
