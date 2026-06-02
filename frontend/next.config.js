/**
 * Dev proxy rewrites to avoid cross-origin cookie issues during development.
 * Routes:
 *  - /api/auth/*  -> http://localhost:5000/api/auth/*
 *  - /api/utils/* -> http://localhost:5001/api/utils/*
 *  - /api/user/*  -> http://localhost:5002/api/user/*
 *  - /api/job/*   -> http://localhost:5003/api/job/*
 */
module.exports = {
  // allow loading remote images from Cloudinary (used for resumes/profile pics)
  images: {
    domains: ["res.cloudinary.com"],
  },

  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:5000/api/auth/:path*',
      },
      {
        source: '/api/utils/:path*',
        destination: 'http://localhost:5001/api/utils/:path*',
      },
      {
        source: '/api/user/:path*',
        destination: 'http://localhost:5002/api/user/:path*',
      },
      {
        source: '/api/job/:path*',
        destination: 'http://localhost:5003/api/job/:path*',
      },
    ];
  },
};
