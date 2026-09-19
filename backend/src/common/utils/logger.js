import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const transport = isProduction
  ? pino.transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination: process.stdout.fd },
        },
        {
          target: '@logtail/pino',
          options: {
            sourceToken: process.env.BETTERSTACK_TOKEN,
            options: {
              endpoint: `https://${process.env.BETTERSTACK_INGESTING_HOST}`,
            },
          },
        },
      ],
    })
  : pino.transport({
      targets: [
        {
          target: 'pino-pretty',
          options: { destination: process.stdout.fd },
        },

        {
          target: 'pino-pretty',
          options: { destination: '.log/output.log', mkdir: true },
        },
      ],
    });

export const logger = pino(
  {
    level: 'info',
    redact: ['req.headers.authorization', 'password', 'token'],
  },
  transport,
);
