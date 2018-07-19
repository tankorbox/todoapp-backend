'use strict';

import HTTPStatus from 'http-status';

export default class AuthorizationError extends Error {

    constructor(message) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'AuthorizationError';
        this.status = HTTPStatus.UNAUTHORIZED;
    }

}