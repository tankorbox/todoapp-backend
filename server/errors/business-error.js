'use strict';

import HTTPStatus from 'http-status';

export default class BusinessError extends Error {

    constructor(message, status = HTTPStatus.BAD_REQUEST) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'BusinessError';
        this.status = status;
    }

}