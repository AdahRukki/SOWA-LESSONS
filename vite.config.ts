import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({plugins:[react(),VitePWA({registerType:'autoUpdate',manifest:{name:'SOWA Lessons',short_name:'SOWA Lessons',start_url:'/',display:'standalone',background_color:'#fbf8f0',theme_color:'#0870b5',icons:[{src:'/assets/sowa-logo-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'/assets/sowa-logo-512.png',sizes:'512x512',type:'image/png',purpose:'any'}]},workbox:{navigateFallback:'/index.html',maximumFileSizeToCacheInBytes:4*1024*1024}})]});
