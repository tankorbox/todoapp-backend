'use strict';

import {authController} from '../controllers';
import {Wrapper} from '../helpers'

module.exports = (app, router) => {

	router
		.route('/auth/login')
		.post(Wrapper(authController.login));

	router
		.route('/auth/logout')
		.post(Wrapper(authController.logout));

	router
		.route('/auth/signup')
		.post(Wrapper(authController.signup));

};