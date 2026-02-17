/** @type {import('next').NextConfig} */
const nextConfig = {
  // En Amplify es mejor NO forzar trailing slash ni meter redirects manuales
  trailingSlash: false,
};

module.exports = nextConfig;
