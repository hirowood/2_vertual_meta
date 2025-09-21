/** @type {import('next').NextConfig} */
const nextConfig = {
  // APIのプロキシ設定
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
  
  // 環境変数の設定
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000',
  },

  // 画像の最適化設定
  images: {
    domains: ['localhost'],
  },

  // TypeScriptの厳格モード
  typescript: {
    // 本番ビルド時のTypeScriptエラーを無視しない
    ignoreBuildErrors: false,
  },

  // ESLintの設定
  eslint: {
    // 本番ビルド時のESLintエラーを無視しない
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
