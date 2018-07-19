

import TaskRepository from "./task-repository";
import UserRepository from "./user-repository";
import ItemRepository from "./item-repository";

module.exports = {
	taskRepository : new TaskRepository(),
	userRepository : new UserRepository(),
	itemRepository : new ItemRepository()
};