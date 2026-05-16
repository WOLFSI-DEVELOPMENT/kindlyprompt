import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  turbopack: {},
  webpack: (config, {dev, isServer}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            "async_hooks": false,
            "perf_hooks": false,
            "fs": false,
            "path": false,
            "os": false,
            "crypto": false,
            "stream": false,
            "tls": false,
            "net": false,
            "worker_threads": false,
            "events": false,
            "module": false,
            "http": false,
            "https": false,
            "url": false,
            "zlib": false,
            "util": false,
            "assert": false,
            "child_process": false,
            "diagnostics_channel": false,
        };
    }
    return config;
  },
};

export default nextConfig;
