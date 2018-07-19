'use strict';

import HTTPStatus from 'http-status';

export default class NotFoundError extends Error {

	constructor(message, status = HTTPStatus.NOT_FOUND) {
		super(message);

		Error.captureStackTrace(this, this.constructor);

		this.name = 'NotFoundError';
		this.status = status;
	}

}