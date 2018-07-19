'use strict';

import JWT from 'jsonwebtoken';
import {config} from '../config'

export default class JWTHelper {

	static async verify(key, token) {
		return new Promise((fulfill, reject) => {
			JWT.verify(
				token,
				key,
				{
					algorithm: 'RS256'
				},
				(error, decoded) => {
					if (error) {
						reject(error);
					} else {
						fulfill(decoded);
					}
				}
			)
		});
	}

	static sign(data, cert) {
		return JWTHelper.sign(
			{
				id: data.id,
				role: data.role
			},
			cert,
			{
				algorithm: 'RS256',
				expiresIn: 123
			},
		);
	}

}