import Response from '../helpers/response';
import HttpStatus from 'http-status';
import {userRepository} from '../repositories/index'
import {Task} from '../models/index'
import Path from 'path';
import uuidv4 from 'uuid/v4';
import {validatePassword} from '../helpers/validate-helper';
import {ValidationError} from "../errors";

export default class UserController {

	getUser = async (req, res) => {
		const userId = req.user.id;
		const user = await userRepository.get({
			where: {
				id: userId
			}
		});
		if (!user) {
			throw new ValidationError('USER_NOT_FOUND')
		}
		Response.success(res, user);
	};

	postUser = async (req, res) => {
		const data = req.body;
		try {
			//TODO: validation
			let user = await userRepository.create(data);
			Response.success(res, user)
		}
		catch (e) {
			throw new ValidationError(e);
		}
	};

	putUser = async (req, res) => {
		const id = req.user.id;
		const data = req.body;
		delete data.username;
		delete data.password;
		delete data.role;
		const user = await userRepository.get({
			where: {
				id: id
			}
		});
		if (!user) {
			throw new ValidationError('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
		}
		await user.update(data);
		Response.success(res, user);
	};

	deleteUser = async (req, res) => {
		const id = req.params.id;
		try {
			const result = await userRepository.delete({
				id: id
			});
			Response.success(res, result);
		}
		catch (e) {
			throw new Error(e);
		}
	};

	uploadAvatar = async (req, res) => {
		if (!req.files) {
			throw new ValidationError('NO_FILE_UPLOADED');
		}
		const file = req.files.file;
		const fileName = `${uuidv4()}${Path.extname(file.name)}`;
		await file.mv(Path.join(__dirname, '..', '..', 'public', 'uploads', `${fileName}`));
		const result = {
			originalName: file.name,
			newName: fileName
		};
		Response.returnSuccess(res, result);
	};

	changePassword = async (req, res) => {
		const userId = req.user.id;
		const {oldPassword, newPassword} = req.body;
		if (!validatePassword(newPassword)) {
			throw new ValidationError('NEW_PASSWORD_NOT_VALID');
		}
		const user = await userRepository.get({
			where: {
				id: userId
			},
			attributes: ['id', 'username', 'password', 'role'],
		});
		if (!user) {
			throw new ValidationError('USER_NOT_FOUND');
		}
		const isOldPasswordValid = await user.comparePassword(oldPassword);
		if (!isOldPasswordValid) {
			throw new ValidationError('PASSWORD_WRONG');
		}
		const result = await userRepository.update({
			password: newPassword
		}, {
			where: {
				id: userId
			}
		});
		Response.success(res, result);
	};
}