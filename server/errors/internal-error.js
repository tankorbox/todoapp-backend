'use strict';

import HTTPStatus from 'http-status';

export default class InternalError extends Error {

	constructor(message, status = HTTPStatus.BAD_REQUEST) {
		super(message);

		Error.captureStackTrace(this, this.constructor);

		this.name = 'InternalError';
		this.status = status;
	}

}