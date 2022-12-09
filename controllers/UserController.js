const { User } = require('../models');

const GetAllUsers = async (req, res) => {
	try {
		const allUsers = await User.findAll({});
		res.send(allUsers);
	} catch (error) {
		throw error;
	}
};

const GetUserDetailsById = async (req, res) => {
	try {
		const userId = parseInt(req.params.id);
		const user = await User.findByPk(userId);
		res.send(user);
	} catch (error) {
		throw error;
	}
};

const FollowAUser = async (req, res) => {
	try {
	} catch (error) {
		throw error;
	}
};

const UpdateUserById = async (req, res) => {
	try {
		const userId = parseInt(req.params.id);
		const user = await User.update(req.body, {
			where: { id: userId },
			returning: true
		});
		return res.status(200).send({
			msg: `User with id ${userId} was updated.`,
			payload: user
		});
	} catch (error) {
		throw error;
	}
};

const DeleteUserById = async (req, res) => {
	try {
		const userId = parseInt(req.params.id);
		const user = await User.findByPk(userId);
		await User.destroy({
			where: { id: userId }
		});
		return res.status(200).send({
			msg: `User with id ${user.id} was deleted.`,
			payload: user
		});
	} catch (error) {
		throw error;
	}
};

module.exports = {
	GetAllUsers,
	GetUserDetailsById,
	UpdateUserById,
	DeleteUserById
};
