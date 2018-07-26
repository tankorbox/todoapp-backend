import {taskRepository} from '../repositories'
import Response from "../helpers/response";
import {Item} from '../models';
import {Op} from '../models/index';
import Moment from 'moment';
import AppError from '../errors/app-error';

export default class TaskController {

	getTasks = async (req, res) => {
		const page = req.query.page;
		const limit = req.query.limit;
		const userId = req.user.id;
		const syncedAt = req.query.syncedAt;
		let updatedAt = null;
		if (syncedAt) {
			updatedAt = {
				[Op.gt]: Moment(syncedAt).utc()
			};
		}
		let tasks = await taskRepository.getAll({
			order: [
				['deadline', 'DESC']
			],
			where: {
				userId: userId
			},
			limit: limit,
			page: page
		});
		Response.success(res, tasks);
	};

	getTask = async (req, res) => {
		const id = req.params.id;
		const task = await taskRepository.get({
			where: {
				id: id
			},
			include: [{
				model: Item,
				as: 'items',
				attributes: {
					exclude: ['deletedAt', 'createdAt']
				}
			}]
		});
		if (!task) {
			throw AppError.Validation('TASK_NOT_FOUND');
		}
		Response.success(res, task);
	};

	postTaskCreate = async (req, res) => {
		const userId = req.user.id;
		const name = req.body.name.trim();
		const content = req.body.content.trim();
		const deadline = req.body.deadline;
		console.log(deadline);
		const status = req.body.status;
		let result = await taskRepository.create({
			userId: userId,
			name: name,
			content: content,
			deadline: deadline
		});
		Response.success(res, result);
	};

	putTaskUpdate = async (req, res) => {
		const taskId = req.params.id;
		const {name, content, deadline, status} = req.body;
		const temp = {name, content, deadline, status};
		const data = {};
		Object.keys(temp).map(key => {
			if (temp[key]) {
				data[key] = temp[key];
			}
		});
		const result = await taskRepository.update(data, {
			where: {
				id: taskId
			},
			returning: true,
			plain: true
		});
		Response.success(res, result[1]);
	};


	deleteTasks = async (req, res) => {
		const userId = req.user.id;
		const taskIds = req.body.taskIds;
		const whereCondition = {
			id: {
				[Op.in]: taskIds
			},
			userId: userId
		};
		const result = await taskRepository.remove(whereCondition);
		if (result) {
			Response.success(res, true);
		}
		else throw AppError.Validation('Error');
	};

	deleteTask = async (req, res) => {
		const userId = req.user.id;
		const taskId = req.params.id;
		const whereCondition = {
			id: taskId,
			userId: userId
		};
		const result = await taskRepository.delete(whereCondition);
		Response.success(res, result);
	};

	putTasks = async (req, res) => {
		const userId = req.user.id;
		const taskIds = req.body.taskIds;
		const {status, name, content, deadline} = req.body;
		const temp = {status, name, content, deadline};
		const data = {};
		Object.keys(temp).map(key => {
			if (temp[key]) {
				data[key] = temp[key];
			}
		});
		const whereCondition = {
			id: {
				[Op.in]: taskIds
			},
			userId: userId
		};
		const result = await taskRepository.update(data, {
			where: whereCondition
		});
		Response.success(res, result);
	};

	getTrashes = async (req, res) => {
		const userId = req.user.id;
		const page = req.params.page;
		const tasks = await taskRepository.getTrashes({
			order: [
				['updatedAt', 'DESC']
			],
			page: page,
			where: {
				userId: userId,
				deletedAt: {
					[Op.not]: null
				}
			},
			paranoid: false
		});
		Response.success(res, tasks);
	};

	restoreTask = async (req, res) => {
		const userId = req.user.id;
		const taskIds = req.body.taskIds;
		const whereCondition = {
			id: {
				[Op.in]: taskIds
			},
			userId: userId
		};
		const result = await taskRepository.restore(whereCondition);
		Response.success(res, result);
	};
}