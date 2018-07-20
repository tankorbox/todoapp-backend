'use strict';

import BaseRepository from "./base-repository";
import {Task} from '../models/index'

export default class TaskRepository extends BaseRepository {

	remove = async (where) => {
		const now = new Date();
		return await this._model.update({
			updatedAt: now,
			deletedAt: now
		}, {
			where
		})
	};
	getTrashes = async (options) => {
		if (!options.limit) {
			options.limit = 100;
		} else {
			options.limit = parseInt(options.limit);
		}
		if (options.page) {
			options.page = parseInt(options.page);
			options.offset = ((options.page - 1) * options.limit);
			delete options.page;
		}
		return await this._model.findAll(options);
	};
	restore = async (where) => {
		return await this._model.update({
			deletedAt: null
		}, {
			where,
			paranoid: false
		})
	};

	constructor() {
		super(Task);
	}

}