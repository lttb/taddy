// @ts-expect-error no types yet
import taddyPlugin from '@taddy/vite-plugin-vue-taddy';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    vite: {
        plugins: [taddyPlugin()],
    },
});
