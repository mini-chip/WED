/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SUPABASE_URL: "your_supabase_url",
    SUPABASE_KEY: "your_supabase_key",
  },
};

export default nextConfig;
