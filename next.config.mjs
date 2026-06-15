const cdnHost = process.env.NEXT_PUBLIC_CDN_HOSTNAME || null;

const remotePatterns = [
  { protocol: "https", hostname: "*.r2.dev" },
  { protocol: "https", hostname: "*.cloudflare.com" },
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "http", hostname: "localhost" },
  // Netravox S3 bucket — *.amazonaws.com tek subdomain yakalar, çok noktalı URL'i yakalamaz
  { protocol: "https", hostname: "netravox-media.s3.us-east-1.amazonaws.com" },
];

if (cdnHost) {
  remotePatterns.push({ protocol: "https", hostname: cdnHost });
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const backendUrl = process.env.BACKEND_URL || "http://localhost:5001";

const nextConfig = {
  images: { remotePatterns },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    // Dev ortamında /uploads/* isteklerini local backend'e proxy'le
    if (process.env.NODE_ENV !== "production") {
      return [{ source: "/uploads/:path*", destination: `${backendUrl}/uploads/:path*` }];
    }
    return [];
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
