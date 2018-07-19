'use strict';

import {taskRepository} from '../repositories';
import Faker from 'faker';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// return await taskRepository.create({
		// 	name: Faker.name.findName(),
		// 	deadline: Faker.date.future(2),
		// 	content: Faker.name.findName(),
		// 	userId: '732c4dea-2bc9-4ca4-be1f-213d4054f358'
		// });
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
	}
};
