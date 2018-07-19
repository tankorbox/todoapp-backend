'use strict';

const Bcrypt = require('bcrypt');

const Roles = {
	ADMIN: 'admin',
	NORMAL: 'normal'
};

const Genders = {
	MALE: 'male',
	FEMALE: 'female'
};

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true
			},
			username: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: true
				}
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			avatar: {
				type: DataTypes.STRING
			},
			displayName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			role: {
				type: DataTypes.ENUM(Object.values(Roles)),
				defaultValue: Roles.NORMAL
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
			freezeTableName: true,
			indexes: [
				{
					fields: ['id', 'username']
				}
			],
			classMethod: {
				generateHash(password) {
					return Bcrypt
						.hash(password, 8)
						.then((data) => {
							return data;
						})
						.catch(() => {
							return false;
						})
				}
			}
		}
	);

	User.associate = (models) => {
		User.hasMany(models.Task, {
			as: 'tasks',
			foreignKey: 'userId'
		});
	};

	User.generateHash = async (password) => {
		return await Bcrypt.hash(password, 8);
	};

	User.prototype.comparePassword = async function (password) {
		console.log(this.dataValues);
		console.log(password);
		return await Bcrypt.compare(password, this.dataValues.password);
	};

	User.beforeBulkUpdate(async function (user, options) {
		if (user.attributes.password) {
			user.attributes.password = await User.generateHash(user.attributes.password);
		}
		return user;
	});

	User.beforeSave(async function (user, options) {
		if (user.password) {
			user.password = await User.generateHash(user.password);
		}
		return user;
	});

	User.Roles = Roles;
	User.Genders = Genders;
	return User;
};