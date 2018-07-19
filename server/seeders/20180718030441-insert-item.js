'use strict';

import {itemRepository} from '../repositories/index';
import Faker from 'faker';

module.exports = {
  up: async (queryInterface, Sequelize) => {
	  return await itemRepository.create({
	  	name: Faker.name.findName(),
	  	content: Faker.name.findName(),
	  	taskId: '40fa31ea-4d73-4702-ae87-c7c7a7665153'
	  });
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
