import DotENV from 'dotenv';
import Config from '../config/config.json';
import DBConfig from '../config/db-config.json';

DotENV.config();
const env = process.env.NODE_ENV;

module.exports = {
	env: env,
	port: process.env.PORT,
	config: Config[env],
	dbConfig: DBConfig[env]
};