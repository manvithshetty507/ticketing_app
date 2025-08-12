/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true, // If using styled-components
  },
  experimental: {
    esmExternals: true, // Allows proper ESM imports
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
      watchOptions: {
        ...config.watchOptions,
        poll: 300,
      },
    });
    return config;
  },
};

module.exports = nextConfig;
