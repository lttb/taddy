const withTaddy = require('@taddy/next-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
};

module.exports = withTaddy()(nextConfig);
