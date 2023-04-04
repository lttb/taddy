import taddyPlugin from '@taddy/vite-plugin';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    vite: {
        plugins: [taddyPlugin()],
    },
});
