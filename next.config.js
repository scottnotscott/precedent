/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.discordapp.com", "media.tenor.com", "i.imgur.com"],
  },
};

module.exports = nextConfig;
