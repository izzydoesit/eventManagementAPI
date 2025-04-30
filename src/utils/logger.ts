import {createLogger, loggers, format, transports } from 'winston';
const { combine, json, timestamp, label, prettyPrint, printf, colorize } = format;

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

loggers.add('controllers', {
  format: combine(
    label({ label: 'CONTROLLERS' }),
    json()
  ),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: 'logs/controllers.log' })
  ]
});

loggers.add('services', {
  format: combine(
    label({ label: 'SERVICES' }),
    json()
  ),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: 'logs/services.log' })
  ]
});

loggers.add('routes', {
  format: combine(
    label({ label: 'ROUTES' }),
    json()
  ),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: 'logs/routes.log' })
  ]
});

loggers.add('Middleware', {
  format: combine(
    label({ label: 'MIDDLEWARE' }),
    json()
  ),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: 'logs/middleware.log' })
  ]
});

loggers.add('utilities', {
  format: combine(
    label({ label: 'UTILITIES' }),
    json()
  ),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: 'logs/utilities.log' })
  ]
});

const logger = createLogger({
  level: 'info',
  format: combine(json(), colorize({ all: true }), timestamp(), prettyPrint(), customFormat),
  transports: [
    new transports.Console({ format: format.simple() }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;