/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  env: {
    API_GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://localhost:8080',
    KEYCLOAK_URL: process.env.KEYCLOAK_URL || 'http://localhost:8080',
    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM || 'lms-realm',
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || 'lms-frontend',
  },
}

module.exports = nextConfig