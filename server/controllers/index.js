import UserController from './user-controller';
import TaskController from "./task-controller";
import AuthController from './auth-controller';
import ItemController from "./item-controller";

module.exports = {
	userController: new UserController(),
	taskController: new TaskController(),
	authController: new AuthController(),
	itemController: new ItemController()
};