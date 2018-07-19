'use strict';

import HTTPStatus from 'http-status';
import Logger from '../helpers/log-helper'

module.exports = (error, req, res, next) => {
	if (error === 'Error') {
		Logger.error(error.stack || error.message);
		res
			.status(HTTPStatus.INTERNAL_SERVER_ERROR)
			.send({
				error: {
					message: 'Sorry! We have something wrong. Please try again later!',
					code: HTTPStatus.INTERNAL_SERVER_ERROR
				}
			});
	} else {
		res
			.status(error.status || HTTPStatus.BAD_REQUEST)
			.send({
				error: {
					message: error.message,
					code: error.status || HTTPStatus.BAD_REQUEST
				}
			});
	}
};