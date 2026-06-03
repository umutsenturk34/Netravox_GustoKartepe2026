const cdnHost = process.env.NEXT_PUBLIC_CDN_HOSTNAME || null;

const remotePatterns = [
  { protocol: "https", hostname: "*.r2.dev" },
  { protocol: "https", hostname: "*.cloudflare.com" },
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "http", hostname: "localhost" },
];

if (cdnHost) {
  remotePatterns.push({ protocol: "https", hostname: cdnHost });
} else {
  remotePatterns.push({ protocol: "https", hostname: "*.amazonaws.com" });
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig = {
  images: { remotePatterns },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/info", destination: "/iletisim", permanent: true },
      { source: "/menu", destination: "/restoran/menu", permanent: true },
      { source: "/rezervasyon", destination: "/restoran/rezervasyon", permanent: true },
    ];
  },
};

export default nextConfig;
