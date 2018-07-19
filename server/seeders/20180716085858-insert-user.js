'use strict';

import {User} from '../models';
import {userRepository} from '../repositories';
import Faker from 'faker';


module.exports = {
	up: async (queryInterface, Sequelize) => {
		// return await userRepository.create({
		// 	username: Faker.internet.exampleEmail(),
		// 	password: '123456',
		// 	displayName: Faker.name.findName(),
		// 	roles: User.Roles.NORMAL
		// });
	},

	down: async (queryInterface, Sequelize) => {

	}
};
