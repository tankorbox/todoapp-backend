'use strict';

import {authController, userController} from '../controllers';
import {Wrapper} from '../helpers';

module.exports = (app, router) => {

	router
		.route('/users')
		.get([authController.isAuth, authController.isAdmin], Wrapper(userController.getUser))
		.post([authController.isAuth, authController.isAdmin], Wrapper(userController.postUser))
		.put([authController.isAuth], Wrapper(userController.putUser));

	router
		.route('users/:id')
		.delete([authController.isAuth, authController.isAdmin], Wrapper(userController.deleteUser));

	router
		.route('/users/avatars/upload')
		.post([authController.isAuth], Wrapper(userController.uploadAvatar));

	router
		.route('/users/changePassword')
		.put([authController.isAuth], Wrapper(userController.changePassword));

};