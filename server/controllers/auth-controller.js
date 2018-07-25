'use strict';

import {HTTPStatus, Response} from '../helpers/index';
import {userRepository} from '../repositories';
import FS from 'fs';
import Path from 'path';
import JWT from 'jsonwebtoken';
import {User} from '../models';
import {config} from '../config';
import {validateEmail, validatePassword} from '../helpers/validate-helper';
import {AuthorizationError, ValidationError} from '../errors/index';


export default class AuthController {

	signup = async (req, res) => {
		const {username, password, displayName, avatar} = req.body;
		if (!validateEmail(username)) {
			throw new ValidationError('EMAIL_INVALID');
		}
		if (!validatePassword(password)) {
			throw new ValidationError('PASSWORD_INVALID')
		}
		const isUserExist = await this.checkUserExist(username);
		if (isUserExist) {
			throw new ValidationError('ACCOUNT_EXISTED');
		}
		try {
			const user = await userRepository.create({
				username: username,
				password: password,
				displayName: displayName,
				avatar: avatar
			});
			delete user.dataValues.password;
			Response.success(res, user);
		}
		catch (e) {
			throw new ValidationError('Something went wrong!');
		}
	};

	login = async (req, res) => {
		const {username, password} = req.body;
		if (!validateEmail(username)) {
			throw new ValidationError('EMAIL_INVALID');
		}
		const user = await userRepository.get({
			attributes: ['id', 'username', 'password', 'role'],
			where: {
				username: username
			},
		});
		if (!user) {
			throw new ValidationError('USER_NOT_FOUND');
		} else {
			const isValidPassword = await user.comparePassword(password);
			if (!isValidPassword) {
				throw new AuthorizationError('WRONG_PASSWORD');
			}
			else {
				const path = Path.resolve(__dirname, '..', 'config', 'cert', 'private.key');
				const cert = FS.readFileSync(path);
				const expired_in = config.TOKEN_EXPIRE_TIME || 1234567;
				const token = JWT.sign({
						id: user.id,
						role: user.role
					},
					cert,
					{
						algorithm: 'RS256',
						expiresIn: expired_in
					});
				const userJson = {
					accessToken: token,
					expire_in: expired_in
				};
				Response.success(res, userJson);
			}
		}
	};


	logout = async (req, res) => {
		try {
			//TODO
			Response.success(res, true);
		} catch (e) {
			throw new ValidationError('LOGOUT_FAILED')
		}
	};


	isAdmin = async (req, res, next) => {
		if (req.user.role === User.Roles.ADMIN) {
			next();
		} else {
			throw new AuthorizationError('NOT_ALLOWED');
		}
	};


	isAuth = async (req, res, next) => {
		let token;

		if (req.headers && req.headers.authorization) {
			let parts = req.headers.authorization.split(' ');
			if (parts.length === 2) {
				const scheme = parts[0];
				const credentials = parts[1];
				if (/^Bearer$/i.test(scheme)) {
					token = credentials;
				}
			} else {
				next(new Error('Format is Authorization: Bearer [token]'));
				return;
			}
		} else if (req.params.token) {
			token = req.params.token;
			delete req.query.token;
		} else {
			next(new Error('No Authorization header was found'), HTTPStatus.UNAUTHORIZED);
			return;
		}

		const path = Path.resolve(__dirname, '..', 'config', 'cert', 'public.key');
		const cert = FS.readFileSync(path);
		JWT.verify(token, cert, {algorithms: ['RS256']}, async (error, payload) => {
			if (error) {
				throw new ValidationError(error);
			}
			try {
				const user = await userRepository.get({
					where: {
						id: payload.id
					}
				});
				if (!user) {
					next(new ValidationError('USER_NOT_FOUND'));
					return;
				}
				req.user = user;
				next();
			} catch (error) {
				next(error)
			}
		});
	};

	checkUserExist = async (username) => {
		const isUserExist = await userRepository.get({
			where: {
				username: username
			}
		});
		return !!isUserExist;
	}

}