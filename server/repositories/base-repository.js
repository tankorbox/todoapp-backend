'use strict';

export default class BaseRepository {

	constructor(model) {
		this._model = model
	}

	async getAll(options) {
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
		if (!options.attributes) {
			options.attributes = {
				exclude: ['password', 'deletedAt', 'createdAt', 'updatedAt']
			};
		}
		return await this._model.findAll(options);
	}

	async get(options) {
		if (!options.attributes) {
			options.attributes = {
				exclude: ['deletedAt', 'createdAt', 'updatedAt']
			}
		}
		return await this._model.findOne(options);
	}

	create = async (data, options) => {
		return await this._model.create(data, options);
	};

	async update(values, options) {
		return await this._model.update(values, options);
	}

	async delete(where) {
		const now = new Date();
		return await this._model.update({
			updatedAt: now,
			deletedAt: now
		}, {
			where,
			returning: true,
			plain: true,
			paranoid: false
		})
	}

	async destroy(options) {
		return await this._model.destroy(options);
	}

	async bulkCreate(values) {
		return await this._model.bulkCreate(values);
	}

	async max(column, where) {
		return await this._model.max(column, where);
	}

	async count(options) {
		return await this._model.count(options);
	};

	async findOrCreate(where, defaults) {
		return await this._model.findOrCreate({where, defaults});
	}

}