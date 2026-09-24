import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
}

module.exports = {
  allowedDevOrigins: ['10.0.0.150'],
}

export default nextConfig
