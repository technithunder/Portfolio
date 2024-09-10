module.exports = ({ env }) => ({
  email: {
    provider: 'sendgrid',
    providerOptions: {
      apiKey: env('SENDGRID_API_KEY'),
    },
  },
  upload: {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_ACCESS_SECRET'),
      region: env('AWS_REGION'),
      params: {
        Bucket: env('AWS_BUCKET_NAME'),
      },
    },
  },
  graphql: {
    amountLimit: 1000,
    endpoint: '/graphql',
    shadowCRUD: true,
    playgroundAlways: false,
    depthLimit: 7,  
    apolloServer: {
      tracing: false,
    },
  },
});
