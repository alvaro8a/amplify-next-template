/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      { source: "/aurora", destination: "/aurora/", permanent: false },
      { source: "/app/login", destination: "/app/login/", permanent: false },
      { source: "/register", destination: "/register/", permanent: false },
      { source: "/welcome", destination: "/welcome/", permanent: false },
    ];
  },
};

module.exports = nextConfig;
