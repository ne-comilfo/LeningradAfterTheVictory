/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false, // Отключает ошибку с Suspense
      },
};

export default nextConfig;
