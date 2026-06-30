import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.zerocom.app' },
      { protocol: 'https', hostname: 'cdn.zerocom.app' },
      { protocol: 'https', hostname: 'localhost' },
    ],
  },
};
export default nextConfig;
