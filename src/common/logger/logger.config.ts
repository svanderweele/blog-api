import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
export const loggerOptions: WinstonModuleOptions = {
  level: 'debug',
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
  ),
  defaultMeta: {
    service: 'blogs-api',
    buildInfo: {
      nodeVersion: process.version,
    },
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      level: 'debug',
      filename: './logs/combined.log',
    }),
  ],
};
