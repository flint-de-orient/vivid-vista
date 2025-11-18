/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://vivid-vista.onrender.com/api'
      : 'http://localhost:5000/api'
  }
}

module.exports = nextConfig