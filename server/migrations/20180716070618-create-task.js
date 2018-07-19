'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
  	return queryInterface.createTable('Task', {
	    id: {
		    type: DataTypes.UUID,
		    defaultValue: DataTypes.UUIDV4,
		    allowNull: false,
		    primaryKey: true
	    },
	    name: {
	    	type: DataTypes.STRING,
		    allowNull:false
	    },
	    content: {
	    	type: DataTypes.STRING
	    },
	    deadline: {
	    	type: DataTypes.DATE,
		    allowNull: false
	    },
	    userId: {
	    	type: DataTypes.UUID,
		    references: {
	    		model: 'User',
			    key: 'id',
			    allowNull: false,
			    onDelete: 'CASCADE'
		    }
	    },
	    status: {
			type: DataTypes.ENUM('ready', 'in_progress', 'done'),
		    defaultValue: 'in_progress'
	    },
	    createdAt: {
		    type: DataTypes.DATE,
		    defaultValue: DataTypes.NOW,
		    allowNull: false
	    },
	    updatedAt: {
		    type: DataTypes.DATE,
		    defaultValue: DataTypes.NOW,
		    allowNull: false
	    },
	    deletedAt: {
		    type: DataTypes.DATE
	    }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Task')
  }
};
