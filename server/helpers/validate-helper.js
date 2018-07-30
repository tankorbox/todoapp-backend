'use strict';

import ValidationError from '../errors/validation-error';
import {check, validationResult} from 'express-validator/check';
import {Task} from '../models';
import Moment from 'moment';

const errorFormatter = ({msg}) => {
	return msg;
};

const validate = (req, res, next) => {
	const errors = validationResult(req).formatWith(errorFormatter).array();
	if (errors.length > 0) {
		const message = errors.map(item => item).join('\n');
		next(new ValidationError(message));
	} else {
		next();
	}
};

const validateEmail = (email) => {
	const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(String(email).toLowerCase());
};


const validatePassword = (password) => {
	const regex = /[a-zA-Z0-9]{8,}/;
	return regex.test(String(password));
};

const validateTaskCreate = (name, content, deadline, status) => {
	console.log(name, content, deadline, status);
	if (name.length >= 80 || content.length >= 80) {
		return false;
	}
	if (Moment(deadline).utc() < Moment(Moment.now()).utc()) {
		return false;
	}
	return true;
};

const validateUserPut = (avatar, displayName)  => {

};

module.exports = {
	validate: validate,
	check: check,
	validateEmail,
	validatePassword: validatePassword,
	validateTaskCreate
};