
import BaseRepository from '../repositories/base-repository';
import {User} from '../models/'

export default class UserRepository extends BaseRepository{
	constructor() {
		super(User)
	}

	async getAll(options) {
		if (!options.limit) {
			options.limit = 1000;
		} else {
			options.limit = parseInt(options.limit);
		}
		if (options.page) {
			options.page = parseInt(options.page);
			options.offset = ((options.page - 1) * options.limit);
			delete options.page;
		}
		if (!options.attributes) {
			options.attributes = {
				exclude: ['password', 'deletedAt']
			};
		}
		return await this._model.findAll(options);
	}

	async get(options) {
		if (!options.attributes) {
			options.attributes = {
				exclude: ['password', 'deletedAt']
			};
		}
		return await this._model.findOne(options);
	}

	async update(data, options) {
		return await this._model.update(data, options);
	}

}