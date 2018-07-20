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
		.route('/users/upload-avatar')
		.post([authController.isAuth], Wrapper(userController.uploadAvatar));

	router
		.route('/users/change-password')
		.put([authController.isAuth], Wrapper(userController.changePassword));

	router
		.route('users/:id')
		.delete([authController.isAuth, authController.isAdmin], Wrapper(userController.deleteUser));

};