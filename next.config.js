/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  images: {
    unoptimized: true,
    loader: 'imgix',
    path: 'https://skaschimer.github.io',
  },
};

module.exports = nextConfig;
