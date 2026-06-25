/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '2svwmgli43.ufs.sh', 
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;