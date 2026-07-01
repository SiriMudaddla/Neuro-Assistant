/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Forces Next.js to build a standalone static "out" folder
  images: {
    unoptimized: true, // Required because mobile apps load local images, not from a web server
  },
};

export default nextConfig;