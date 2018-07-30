import HTTPStatus from 'http-status';
import Logger from '../helpers/log-helper';
import {env} from '../config/index';
import I18N from 'i18n';

export default class Response {

	static success(res, data = null, pageInfo = null) {
		if (typeof data === 'boolean' || data) {
			if (pageInfo) {
				res
					.status(HTTPStatus.OK)
					.json({
						data: data,
						pageInfo: pageInfo
					});

			} else {
				res
					.status(HTTPStatus.OK)
					.json({
						data: data
					});
			}
		} else {
			res
				.status(HTTPStatus.OK)
				.json({});
		}
	}

	static returnSuccess(res, data, pageInfo) {
		if (data || data === 0) {
			if (pageInfo) {
				return res.status(HTTPStatus.OK)
					.json({
						data: data,
						pageInfo
					});
			} else {
				return res.status(HTTPStatus.OK)
					.json({
						data: data
					});
			}

		} else {
			return this.returnError(res, new Error('Data is not found'), HTTPStatus.BAD_REQUEST);
		}
	}

	static error(res, error) {
		if (error.name === 'Error' || error.status === undefined) {
			Logger.error(error.stack || error.message);
			res
				.status(HTTPStatus.INTERNAL_SERVER_ERROR)
				.send({
					error: {
						message: I18N.__('TECHNICAL_ERROR'),
						code: 'TECHNICAL_ERROR',
						statusCode: HTTPStatus.INTERNAL_SERVER_ERROR
					}
				});
		} else {
			res
				.status(error.status || HTTPStatus.BAD_REQUEST)
				.send({
					error: {
						message: error.message,
						code: error.code,
						statusCode: error.status || HTTPStatus.BAD_REQUEST
					}
				});
		}
	}

};
