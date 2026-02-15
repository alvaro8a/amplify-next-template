/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // ← Esto fuerza static export (soluciona 404 en rutas)
  images: {
    unoptimized: true,  // Necesario para static export
  },
  trailingSlash: true,  // Ayuda a rutas como /login/
};

module.exports = nextConfig;
