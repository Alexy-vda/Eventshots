module.exports = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.eventshots.dev" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  },
  // Autoriser les requêtes cross-origin en dev depuis votre réseau local
  allowedDevOrigins: [
    "192.168.32.169",
    "http://192.168.32.169",
    "http://192.168.32.169:3000",
  ],
};
