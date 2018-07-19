'use strict';

import {authController, taskController} from '../controllers';
import {Wrapper} from '../helpers';

module.exports = (app, router) => {

	router
		.route('/tasks')
		.get([authController.isAuth], Wrapper(taskController.getTasks))
		.post([authController.isAuth], Wrapper(taskController.postTaskCreate))
		.delete([authController.isAuth], Wrapper(taskController.deleteTasks))
		.put([authController.isAuth], Wrapper(taskController.putTasks));

	router
		.route('/tasks/trashed')
		.get([authController.isAuth], Wrapper(taskController.getTrashes))
		.delete([authController.isAuth], Wrapper(taskController.deleteTaskPermanently));

	router
		.route('/tasks/restore')
		.put([authController.isAuth], Wrapper(taskController.restoreTask));

	router
		.route('/tasks/:id')
		.get([authController.isAuth], Wrapper(taskController.getTask))
		.put([authController.isAuth], Wrapper(taskController.putTaskUpdate));

};