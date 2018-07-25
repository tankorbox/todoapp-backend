import {Response} from '../helpers/';
import {itemRepository} from '../repositories'
import {ValidationError} from "../errors";
import {Op} from '../models/index';

export default class ItemController {

	postItem = async (req, res) => {
		const {content, status, taskId} = req.body;
		try {
			const result = await itemRepository.create({
				content: content,
				status: status,
				taskId: taskId
			});
			Response.success(res, result);
		}
		catch (e) {
			throw new ValidationError(e);
		}
	};

	getItem = async (req, res) => {
		const id = req.params.id;
		const item = await itemRepository.get({
			where: {
				id: id
			}
		});
		if (!item) {
			throw new ValidationError('ITEM_NOT_FOUND');
		}
		Response.success(res, item);
	};

	deleteItems = async (req, res) => {
		const itemIds = req.body.itemIds;
		console.log(itemIds);
		const whereCondition = {
			id: {
				[Op.in]: itemIds
			}
		};
		let result = await itemRepository.deletes(whereCondition);
		Response.success(res, result);
	};


	putItem = async (req, res) => {
		const id = req.params.id;
		const data = req.body;
		console.log(data);
		const result = await itemRepository.update(
			data, {
			where: {
				id: id
			}
		});
		Response.success(res, result);
	};

	putItems = async (req, res) => {
		const itemIds = req.body.itemIds;
		const {content, status} = req.body;
		const temp = {content, status};
		const data = {};
		Object.keys(temp).map(key => {
			if (temp[key]) data[key] = temp[key];
		});
		const whereCondition = {
			where: {
				id: {
					[Op.in]: itemIds
				}
			}
		};
		const result = await itemRepository.update(
			data,
			whereCondition
		);
		Response.success(res, result);
	};
}