'use strict';

import Winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const transport = new DailyRotateFile({
	filename: 'notification-%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	dirname: 'logs',
	maxSize: '20m',
	maxFiles: '30d'
});

const infoFormat = Winston.format.printf(info => {
	return `${info.timestamp}: ${info.level}: ${typeof info.message === 'object' ? JSON.stringify(info.message) : info.message}`;
});

const errorFormat = Winston.format.printf(error => {
	return `${error.timestamp}: ${error.level}: ${typeof error.message === 'object' ? JSON.stringify(error.message) : error.message}`;
});

const logger = Winston.createLogger({
	format: Winston.format.combine(
		Winston.format.label({ label: 'Notification' }),
		Winston.format.json(),
		Winston.format.timestamp(),
		Winston.format.prettyPrint(),
		infoFormat,
		errorFormat
	),
	transports: [
		transport
	]
});

module.exports = logger;