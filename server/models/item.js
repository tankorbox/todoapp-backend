'use strict';

const Status = {
	IN_PROGRESS: 'in_progress',
	DONE: 'done'
};

module.exports = (sequelize, DataTypes) => {
	const Item = sequelize.define('Item',
		{
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
				type: DataTypes.ENUM(Object.values(Status)),
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
		},
		{
			paranoid: true,
			freezeTableName: true
		}
	);

	Item.associate = (models) => {
		Item.belongsTo(models.Task, {
			foreignKey: 'taskId',
			onDelete: 'CASCADE'
		})
	};

	Item.Status = Status;
	return Item;
};