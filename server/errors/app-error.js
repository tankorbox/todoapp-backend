'use strict';

import HTTPStatus from 'http-status';
import ValidationError from './validation-error';
import AuthorizationError from './authorization-error';
import BusinessError from './business-error';
import I18N from 'i18n';

export default class AppError {

	static Validation(message, params = null, status = HTTPStatus.BAD_REQUEST) {
		const rawMessage = params !== null ? I18N.__(message, params) : I18N.__(message);
		return new ValidationError(rawMessage, message, status);
	}

	static Authorization(message, params = null) {
		const rawMessage = params !== null ? I18N.__(message, params) : I18N.__(message);
		return new AuthorizationError(rawMessage, message);
	}

	static Business(message, params = null, status = HTTPStatus.BAD_REQUEST) {
		const rawMessage = params !== null ? I18N.__(message, params) : I18N.__(message);
		return new BusinessError(rawMessage, message, status);
	}

	static NotFound(message, params = null) {
		return AppError.Validation(message, params, HTTPStatus.NOT_FOUND);
	}

	static BadRequest(message, params = null) {
		return AppError.Validation(message, params, HTTPStatus.BAD_REQUEST);
	}

}