'use strict';

import {taskRepository, userRepository} from '../repositories';
import Faker from 'faker';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const users = await userRepository.getAll({});
		for (const user of users) {
			for (let i = 1; i< 500; i++) {
				await taskRepository.create({
					name: Faker.name.findName(),
					deadline: Faker.date.future(2),
					content: Faker.name.findName(),
					userId: user.id
				});
			}
		}
	},

	down: async (queryInterface, Sequelize) => {
		return await taskRepository.destroy({
			where: {},
			force: true
		});
	}
};
