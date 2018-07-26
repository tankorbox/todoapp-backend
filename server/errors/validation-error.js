'use strict';

import HTTPStatus from 'http-status';

export default class ValidationError extends Error {

	constructor(message, code, status = HTTPStatus.BAD_REQUEST) {
		super(message);

		Error.captureStackTrace(this, this.constructor);

		this.code = code;
		this.name = 'ValidationError';
		this.status = status;
	}

}