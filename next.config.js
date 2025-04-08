/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['i.ibb.co', 'd-id-talks-prod.s3.us-west-2.amazonaws.com'],
    },
  };
  
  module.exports = nextConfig;