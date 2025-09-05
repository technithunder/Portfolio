const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
  },
  images: {
    domains: ['orderoasis.net'],
  },
};

export default nextConfig;
