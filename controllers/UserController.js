const { User, Follow } = require('../models');

const GetAllUsers = async (req, res) => {
	try {
		const allUsers = await User.findAll({});
		res.send(allUsers);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const GetUserDetailsById = async (req, res) => {
	try {
		const userId = parseInt(req.params.id);
		const user = await User.findByPk(userId);
		res.send(user);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const CheckFollowStatus = async (req, res) => {
	try {
		const user_id = parseInt(req.params.userId);
		const followedId = parseInt(req.params.followedId);
		const followStatus = await Follow.findAll({
			where: { userId: followedId, followerId: user_id }
		});
		res.send(followStatus);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const ChangeFollowingCount = async (req, res, next) => {
	try {
		const userId = parseInt(req.params.userId);
		const user = await User.findByPk(userId);
		if (req.body.followingUser) {
			const newFollowingCount = parseInt(user.followingCount) - 1;
			const updatedUser = await User.update(
				{ ...user, followingCount: newFollowingCount },
				{
					where: { id: userId },
					raw: true
				}
			);
		} else {
			const newFollowingCount = parseInt(user.followingCount) + 1;
			const updatedUser = await User.update(
				{ ...user, followingCount: newFollowingCount },
				{
					where: { id: userId },
					raw: true
				}
			);
		}
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const ChangeFollowerCount = async (req, res, next) => {
	try {
		const followedId = parseInt(req.params.followedId);
		const followedUser = await User.findByPk(followedId);
		if (req.body.followingUser) {
			const newFollowerCount = parseInt(followedUser.followerCount) - 1;
			const updatedUser = await User.update(
				{ ...followedUser, followerCount: newFollowerCount },
				{
					where: { id: followedId },
					raw: true
				}
			);
		} else {
			const newFollowerCount = parseInt(followedUser.followerCount) + 1;
			const updatedUser = await User.update(
				{ ...followedUser, followerCount: newFollowerCount },
				{
					where: { id: followedId },
					raw: true
				}
			);
		}
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const ChangeFollowUserStatus = async (req, res) => {
	try {
		const user_id = parseInt(req.params.userId);
		const followedId = parseInt(req.params.followedId);
		if (req.body.followingUser) {
			const deleteFollow = await Follow.destroy({
				where: { userId: followedId, followerId: user_id }
			});
			return res.status(200).send({
				msg: `User with ${user_id} id unfollowed user with ${followedId}`,
				payload: deleteFollow
			});
		} else {
			const newFollow = await Follow.create({
				userId: followedId,
				followerId: user_id
			});
			return res.status(200).send({
				msg: `User with ${user_id} id followed user with ${followedId}`,
				payload: newFollow
			});
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
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
		return res.status(500).json({ error: error.message });
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
		return res.status(500).json({ error: error.message });
	}
};

module.exports = {
	GetAllUsers,
	GetUserDetailsById,
	CheckFollowStatus,
	ChangeFollowingCount,
	ChangeFollowerCount,
	ChangeFollowUserStatus,
	UpdateUserById,
	DeleteUserById
};
