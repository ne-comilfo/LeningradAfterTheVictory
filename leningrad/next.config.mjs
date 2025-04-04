/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false, // Отключает ошибку с Suspense
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,

      'swiper/react': 'swiper/react/swiper-react',
      'swiper/modules': 'swiper/modules',
      'swiper': 'swiper/swiper-bundle.min.js',
    };

    return config;
  },
};

export default nextConfig;
