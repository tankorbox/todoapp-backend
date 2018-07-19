import HTTPStatus from 'http-status';
import {env} from '../config/index';

export default class Response {

	static success(res, data = null, pageInfo = null) {
		if (data) {
			if (pageInfo) {
				return res.status(HTTPStatus.OK)
					.json({
						data: data,
						pageInfo
					});

			}
			else {
				return res.status(HTTPStatus.OK)
					.json({
						data: data,
					});
			}

		} else {
			return res.status(HTTPStatus.OK)
				.json();
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

	static error(res, e, code = HTTPStatus.BAD_REQUEST) {
		if (Array.isArray(e.message)) {
			e.message = e.message.map(item => {
				return item;
			}).join('\n');
		}

		if (e.errors) {
			e.message = e.errors.map(item => {
				return item.message;
			}).join('\n');
		}
		return res
			.status(code)
			.send({
				error: {
					message: e.message || e,
					code: code
				}
			});
	}

	static returnError(res, e, code, param) {
		if (typeof e !== 'object') {
			e = new Error(e);
		}
		if (env === 'development') {
			console.log(e);
		}

		if (Array.isArray(e.message)) {
			e.message = e.message.map(item => {
				return item;
			}).join('\n');
		}

		if (e.errors) {
			e.message = e.errors.map(item => {
				return item.message;
			}).join('\n');
		}

		return res
			.status(code)
			.send({
				error: {
					message: e.message || e,
					code: code
				},
			});
	}

};
