import {Response} from '../helpers/';
import {itemRepository} from '../repositories'
import {InternalError, NotFoundError} from "../errors";
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
			return Response.success(res, result);
		}
		catch (e) {
			throw new InternalError(e);
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
			throw new NotFoundError('Item not found!');
		}
		return Response.success(res, item);
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
		return Response.success(res, result);
	};


	putItem = async (req, res) => {
		const id = req.params.id;
		const data = req.body;
		const result = await itemRepository.update({
			data
		}, {
			where: {
				id: id
			}
		});
		return Response.success(res, result);
	};

	putItems = async (req, res) => {
		const itemIds = req.body.itemIds;
		const {name, status} = req.body;
		const temp = {name, status};
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
		return Response.success(res, result);
	};
}