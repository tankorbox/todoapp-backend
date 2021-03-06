'use strict';

export default class BaseRepository {

	constructor(model) {
		this._model = model;
		this._model.hook('beforeCreate', (instance, opts) => {
			console.log('An Instance has been created');
			console.log(instance);
		});
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
				exclude: ['password']
			};
		}
		options.paranoid = false;
		return await this._model.findAll(options);
	}

	async get(options) {
		if (!options.attributes) {
			options.attributes = {
				exclude: ['deletedAt']
			}
		}
		return await this._model.findOne(options);
	}

	async create(data, options) {
		return await this._model.create(data, options);
	}

	async update(values, options) {
		return await this._model.update(values, options);
	}

	async delete(where) {
		return await this._model.destroy({
			where: where,
			returning: true,
			plain: true
		});
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