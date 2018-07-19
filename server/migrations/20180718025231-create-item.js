'use strict';

module.exports = {
	up: (queryInterface, DataTypes) => {
		return queryInterface.createTable('Item', {
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true
			},
			content: {
				type: DataTypes.STRING,
				allowNull: false
			},
			taskId: {
				type: DataTypes.UUID,
				references: {
					model: 'Task',
					key: 'id',
					allowNull: false,
					onDelete: 'CASCADE'
				}
			},
			status: {
				type: DataTypes.ENUM('in_progress', 'done'),
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
		return queryInterface.dropTable('Item');

	}
};
