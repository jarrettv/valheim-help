import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  site: "https://valheim.help",
  integrations: [react()],
  adapter: node({
    mode: 'standalone'
  })
});