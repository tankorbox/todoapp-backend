import UserController from './user-controller';
import TaskController from "./task-controller";
import AuthController from './auth-controller';
import ItemController from "./item-controller";
import SwaggerController from "./swagger-controller";

module.exports = {
	userController: new UserController(),
	taskController: new TaskController(),
	authController: new AuthController(),
	itemController: new ItemController(),
	swaggerController: new SwaggerController()
};