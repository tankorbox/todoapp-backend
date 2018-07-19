import {taskRepository} from '../repositories'
import Response from "../helpers/response";
import {Item} from '../models';
import NotFoundError from "../errors/not-found-error";
import InternalError from "../errors/internal-error";
import {Op} from '../models/index'

export default class TaskController {

	getTasks = async (req, res) => {
		const page = req.query.page;
		const limit = req.query.limit;
		const userId = req.user.id;
		let tasks = await taskRepository.getAll({
			order: [
				['updatedAt', 'DESC']
			],
			where: {
				userId: userId
			},
			limit: limit,
			page: page
		});
		return Response.success(res, tasks);
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
			throw new NotFoundError('TASK_NOT_FOUND');
		}
		return Response.success(res, task);
	};

	postTaskCreate = async (req, res) => {
		const userId = req.user.id;
		const name = req.body.name.trim();
		const content = req.body.content.trim();
		const deadline = req.body.deadline;
		const status = req.body.status;
		let result = await taskRepository.create({
			userId: userId,
			name: name,
			content: content,
			deadline: deadline,
			status: status
		});
		return Response.success(res, result);
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
		try {
			const result = await taskRepository.update(data, {
				where: {
					id: taskId
				}
			});
			return Response.success(res, result);
		}
		catch (e) {
			throw new InternalError(e);
		}
	};


	deleteTasks = async (req, res) => {
		const userId = req.user.id;
		const taskIds = req.body.taskIds;
		try {
			const whereCondition = {
				id: {
					[Op.in]: taskIds
				},
				userId: userId
			};
			const result = await taskRepository.remove(whereCondition);
			return Response.success(res, result);
		}
		catch (e) {
			throw new InternalError(e);
		}
	};

	putTasks = async(req, res) => {
		const userId = req.user.id;
		const taskIds = req.body.taskIds;
		const {status, name, content, deadline} = req.body;
		const temp = {status, name, content, deadline};
		const data = {};
		Object.keys(temp).map(key => {
			if (temp[key]) data[key] = temp[key];
		});
		const whereCondition = {
			id: {
				[Op.in]: taskIds
			},
			userId: userId
		};
		try {
			const result = await taskRepository.update(data, {
				where: whereCondition
			});
			return Response.success(res, result);
		}
		catch (e) {
			throw new InternalError(e);
		}
	};

	getTrashes = async (req, res) => {
		const userId = req.user.id;
		const page = req.params.page;
		const tasks = await taskRepository.getTrashes({
			order: [
				['updatedAt','DESC']
			],
			page: page,
			where: {
				userId: userId,
				deletedAt: {
					[Op.not] : null
				}
			},
			paranoid: false
		});
		return Response.success(res, tasks);
	};

	restoreTask = async (req, res) => {
		const userId = req.user.id;
		const taskIds = req.body.taskIds;
		try {
			const whereCondition = {
				id: {
					[Op.in]: taskIds
				},
				userId: userId
			};
			const result = await taskRepository.restore(whereCondition);
			return Response.success(res, result);
		}
		catch (e) {
			throw new InternalError('Something went wrong!');
		}
	};

	deleteTaskPermanently = async(req, res) => {
		const taskIds = req.body.taskIds;
		const userId = req.user.id;
		const whereCondition = {
			id: {
				[Op.in] : taskIds
			},
			userId: userId
		};
		const result = await taskRepository.deletePermanently(whereCondition);
		return Response.success(res, result);
	}
}