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
		const {username, password, displayName} = req.body;
		if (!validateEmail(username)) {
			const error = new ValidationError('Email is not valid!');
			throw new Error(error);
		}
		if (!validatePassword(password)) {
			throw new ValidationError('Password is not valid!')
		}
		const isUserExist = await this.checkUserExist(username);
		if (isUserExist) {
			const error = new ValidationError('Account is already existed!');
			throw new Error(error);
		}
		try {
			const user = await userRepository.create({
				username: username,
				password: password,
				displayName: displayName
			});
			return Response.success(res, user);
		}
		catch (e) {
			return Response.error(res, e);
		}
	};

	login = async (req, res) => {
		const {username, password} = req.body;
		if (!validateEmail(username)) {
			throw new ValidationError('Email is not valid');
		}
		const user = await userRepository.get({
			attributes: ['id', 'username', 'password', 'role'],
			where: {
				username: username
			},
		});
		if (!user) {
			return Response.error(res, new Error('USER_NOT_FOUND'), HTTPStatus.NOT_FOUND);
		} else {
			const isValidPassword = await user.comparePassword(password);
			if (!isValidPassword) {
				throw new AuthorizationError('Wrong password');
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
				return Response.success(res, userJson);
			}
		}
	};


	logout = async (req, res) => {
		try {
			//TODO
			return Response.success(res, true);
		} catch (e) {
			return Response.error(res, e, HTTPStatus.BAD_REQUEST);
		}
	};


	isAdmin = async (req, res, next) => {
		if (req.user.role === User.Roles.ADMIN) {
			next();
		} else {
			return Response.error(res, new Error('NOT_ALLOWED'), HTTPStatus.UNAUTHORIZED)
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
				return Response.error(res, error, HTTPStatus.BAD_REQUEST);
			}
			try {
				const user = await userRepository.get({
					where: {
						id: payload.id
					}
				});
				if (!user) {
					next(new Error('User not found!'));
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