import Response from '../helpers/response';
import HttpStatus from 'http-status';
import {userRepository} from '../repositories/index'
import {Task} from '../models/index'
import Path from 'path';
import uuidv4 from 'uuid/v4';
import {validatePassword} from '../helpers/validate-helper';
import AppError from "../errors/app-error";

export default class UserController {

	getUser = async (req, res) => {
		const userId = req.user.id;
		console.log(userId);
		const user = await userRepository.get({
			where: {
				id: userId
			}
		});
		if (!user) {
			throw AppError.NotFound('USER_NOT_FOUND');
		}
		user.removePrivateFields();
		Response.success(res, user);
	};

	postUser = async (req, res) => {
		const data = req.body;
		let user = await userRepository.create(data);
		Response.success(res, user);
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
			throw AppError.NotFound('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
		}
		await user.update(data);
		user.removePrivateFields();
		Response.success(res, user);
	};

	deleteUser = async (req, res) => {
		const id = req.params.id;
		const result = await userRepository.delete({
			id: id
		});
		Response.success(res, result);
	};

	uploadAvatar = async (req, res) => {
		if (!req.files) {
			throw AppError.Validation('NO_FILE_UPLOADED');
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

	retrieveAvatar = async (req, res) => {
		const avatarId = req.params.id;
		return res.sendFile(Path.join(__dirname, '..', '..', 'public', 'uploads', avatarId));
	};

	changePassword = async (req, res) => {
		const userId = req.user.id;
		const {oldPassword, newPassword} = req.body;
		console.log(oldPassword);
		console.log(newPassword);
		if (!validatePassword(newPassword)) {
			throw AppError.Validation('NEW_PASSWORD_NOT_VALID');
		}
		const user = await userRepository.get({
			where: {
				id: userId
			},
			attributes: ['id', 'username', 'password', 'role'],
		});
		if (!user) {
			throw AppError.NotFound('USER_NOT_FOUND');
		}
		const isOldPasswordValid = await user.comparePassword(oldPassword);
		if (!isOldPasswordValid) {
			throw AppError.Validation('PASSWORD_WRONG');
		}
		const result = await userRepository.update({
			password: newPassword
		}, {
			where: {
				id: userId
			}
		});
		Response.success(res, true);
	};
}