'use strict';

import AppError from '../errors/app-error';
import {check, validationResult} from 'express-validator/check';

export default class Validator {

	static check = check;

	static validate(req, res, next) {
		const error = validationResult(req).array().shift();
		if (error) {
			next(AppError.Validation(error.msg, {object: error.param}));
		} else {
			next();
		}
	}

}