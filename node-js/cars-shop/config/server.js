module.exports = ({ env }) => ({
  host: env('HOST', '127.0.0.1'),
  port: env.int('PORT', 10080),
  cron: { enabled: true },
  admin: {
    url:  '/admin',
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'admin_jwt_secret'),
    },
  },

});
