'use strict';

import HTTPStatus from 'http-status';

export default class AuthorizationError extends Error {

    constructor(message, code) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.code = code;
        this.name = 'AuthorizationError';
        this.status = HTTPStatus.UNAUTHORIZED;
    }

}