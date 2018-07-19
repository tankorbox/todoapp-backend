'use strict';

import BaseRepository from "./base-repository";
import {Item} from '../models';

export default class ItemRepository extends BaseRepository {
	constructor() {
		super(Item);
	}


	deletes = async (where) => {
		const now = new Date();
		return await this._model.update({
			updatedAt: now,
			deletedAt: now
		}, {
			where
		});
	};
}