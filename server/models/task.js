'use strict';

const Status = {
	READY: 'ready',
	IN_PROGRESS: 'in_progress',
	DONE :'done'
};


module.exports = (sequelize, DataTypes) => {
	const Task = sequelize.define('Task',
		{
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
				type: DataTypes.ENUM(Object.values(Status)),
				defaultValue: Status.IN_PROGRESS
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

	Task.associate = (models) => {
		Task.belongsTo(models.User, {
			foreignKey: 'userId',
			onDelete: 'CASCADE'
		});
		Task.hasMany(models.Item, {
			as: 'items',
			foreignKey: 'taskId'
		})
	};

	Task.Status = Status;
	return Task;
};