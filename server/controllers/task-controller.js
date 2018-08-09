import {taskRepository} from '../repositories'
import Response from "../helpers/response";
import {Item} from '../models';
import {Op} from '../models/index';
import Moment from 'moment';
import moment from 'moment-timezone';
import AppError from '../errors/app-error';
import {validateTaskCreate} from '../helpers/validate-helper';

export default class TaskController {

	getTasks = async (req, res) => {
		const page = req.query.page;
		const limit = req.query.limit;
		const userId = req.user.id;
		const date = req.query.date;
		let startDate = null;
		let endDate = null;
		if (date) {
			const byDate = this.getDateString(date);
			startDate = Moment(byDate).utc()
				.set('hour', 0)
				.set('minute', 0)
				.set('second', 0).add(-7, 'hours');
			endDate = Moment(byDate).utc()
				.set('hour', 23)
				.set('minute', 59)
				.set('second', 59).add(-7, 'hours');
		}
		const options = {
			order: [
				['deadline', 'DESC']
			],
			where: {
				userId: userId
			},
			limit: limit,
			page: page
		};
		if (startDate && endDate) {
			options.where.deadline = {
				[Op.gt]: startDate,
				[Op.lt]: endDate
			}
		}
		let tasks = await taskRepository.getAll(options);
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
				as: 'items'
			}]
		});
		if (!task) {
			throw AppError.Validation('TASK_NOT_FOUND');
		}
		Response.success(res, task);
	};
	postTaskCreate = async (req, res) => {
		const id = req.body.id;
		const userId = req.user.id;
		const name = req.body.name.trim();
		const content = req.body.content.trim();
		const deadline = req.body.deadline;
		const status = req.body.status;
		if (!validateTaskCreate(name, content, deadline, status)) {
			throw AppError.Validation('WRONG_INPUT_VALUE');
		}
		let result = await taskRepository.create({
			id: id,
			userId: userId,
			name: name,
			content: content,
			deadline: Moment(deadline).add(-7, 'hours').utc()
		});
		Response.success(res, result);
	};
	putTaskUpdate = async (req, res) => {
		const taskId = req.params.id;
		const {name, content, deadline, status} = req.body;
		const temp = {name, content, deadline, status};
		if (!validateTaskCreate(name, content, deadline, status)) {
			AppError.Validation('WRONG_INPUT_VALUE');
		}
		const data = {};
		Object.keys(temp).map(key => {
			data[key] = temp[key];
		});
		console.log(data);
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
		Response.success(res, true);
	};
	deleteTask = async (req, res) => {
		const userId = req.user.id;
		const taskId = req.params.id;
		const whereCondition = {
			id: taskId,
			userId: userId
		};
		const result = await taskRepository.delete(whereCondition);
		console.log(result);
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

	getDateString(date) {
		const startIndex = date.indexOf('"');
		const lastIndex = date.lastIndexOf('"');
		return date.slice(startIndex + 1, lastIndex);
	}
}