'use strict';

const FS = require('fs-extra');
const Path = require('path');
const Sequelize = require('sequelize');
const {dbConfig} = require('../config/index');

const basename = Path.basename(module.filename);
dbConfig.operatorsAliases = Sequelize.Op;
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

let db = {};
FS
	.readdirSync(__dirname)
	.filter((file) => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	}).forEach((file) => {
	const model = sequelize['import'](Path.join(__dirname, file));
	db[model.name] = model;
});

for (let [, model] of Object.entries(db)) {
	if (model.associate) {
		model.associate(db);
	}
}

db.sequelize = sequelize;
db.Sequelize = sequelize;
db.Op = Sequelize.Op;


module.exports = db;