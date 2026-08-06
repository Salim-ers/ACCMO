/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // En-têtes de sécurité (durcissement HTTP). Voir README > Sécurité.
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "media-src 'self' https:",
      // 'self' : la visite 360° est desormais servie par le site lui-meme.
      // Mawaqit n'est plus incruste : ses horaires sont lus cote serveur.
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "connect-src 'self'",
      "form-action 'self'",
      // 'self' et non 'none' : la visite 360°, désormais hébergée par le site,
      // est incrustée dans la page /visite-virtuelle. « none » interdisait
      // TOUTE mise en cadre, y compris par le site lui-même. La protection
      // contre le détournement de clic depuis un site tiers reste entière.
      "frame-ancestors 'self'",
      "base-uri 'self'",
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          // Équivalent de `frame-ancestors 'self'` pour les navigateurs
          // anciens : même raison, la visite 360° est incrustée par le site.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};
export default nextConfig;
