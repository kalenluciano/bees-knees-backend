const { User, Follow } = require('../models');

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

const AddToFollowingCount = async (req, res, next) => {
	try {
		const userId = parseInt(req.params.userId);
		const user = await User.findByPk(userId);
		const newFollowingCount = parseInt(user.followingCount) + 1;
		const updatedUser = await User.update(
			{ ...user, followingCount: newFollowingCount },
			{
				where: { id: userId },
				raw: true
			}
		);
		next();
	} catch (error) {
		throw error;
	}
};

const AddToFollowerCount = async (req, res, next) => {
	try {
		const followedId = parseInt(req.params.followedId);
		const followedUser = await User.findByPk(followedId);
		const newFollowerCount = parseInt(followedUser.followerCount) + 1;
		const updatedUser = await User.update(
			{ ...followedUser, followerCount: newFollowerCount },
			{
				where: { id: followedId },
				raw: true
			}
		);
		next();
	} catch (error) {
		throw error;
	}
};

const FollowAUser = async (req, res) => {
	try {
		const user_id = parseInt(req.params.userId);
		const followedId = parseInt(req.params.followedId);
		const newFollow = await Follow.create({
			userId: followedId,
			followerId: user_id
		});
		return res.status(200).send({
			msg: `User with ${user_id} id followed user with ${followedId}`,
			payload: newFollow
		});
	} catch (error) {
		throw error;
	}
};

const UpdateUserById = async (req, res) => {
	try {
		const userId = parseInt(req.params.id);
		const user = await User.update(req.body, {
			where: { id: userId },
			raw: true,
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
			msg: `User with id ${user?.id} was deleted.`,
			payload: user
		});
	} catch (error) {
		throw error;
	}
};

module.exports = {
	GetAllUsers,
	GetUserDetailsById,
	AddToFollowingCount,
	AddToFollowerCount,
	FollowAUser,
	UpdateUserById,
	DeleteUserById
};
