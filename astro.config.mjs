// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://www.miamigoanhelado.com', // Pon tu dominio real aquí
    base: '/',
    integrations: [mdx(), sitemap()],
    // ESTO ES LO QUE FALTA:
    vite: {
        resolve: {
            alias: {
                '~': '/src',
            },
        },
    },
});