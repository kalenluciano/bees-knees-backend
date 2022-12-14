const { User, Follow, PostReaction, Post, PostComment } = require('../models');

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
		const followedUsers = await Follow.findAll({
			where: { followerId: userId }
		});
		const getfollowedUserData = async (userId) => {
			const user = await User.findByPk(userId);
			return user;
		};
		const followedUsersData = await Promise.all(
			followedUsers.map(async (followedUser) => {
				return {
					user: await getfollowedUserData(followedUser.userId)
				};
			})
		);
		await Promise.all(
			followedUsersData.map(
				async (followedUser) =>
					await followedUser.user.decrement('followerCount')
			)
		);
		const userReactions = await PostReaction.findAll({
			where: { userId },
			raw: true
		});
		const getUserReactedPosts = async (postId) => {
			const post = await Post.findByPk(postId);
			return post;
		};
		const userReactedPosts = await Promise.all(
			await userReactions.map(async (userReaction) => {
				return { post: await getUserReactedPosts(userReaction.postId) };
			})
		);
		await Promise.all(
			await userReactedPosts.map(async (userReactedPost) => {
				if (userReactedPost.reactionId === 0) {
					await userReactedPost.post.decrement('flagCount');
				} else {
					await userReactedPost.post.decrement('likesCount');
				}
			})
		);
		const postsByUserId = await Post.findAll({
			where: { userId },
			raw: true
		});
		const handleParentPostOfCommentAndRepost = async (postId) => {
			const parentPostOfComment = await PostComment.findOne({
				where: { commentId: postId }
			});
			if (parentPostOfComment) {
				const postToDecrementComment = await Post.findByPk(
					parentPostOfComment.postId
				);
				if (postToDecrementComment) {
					await Post.update(
						{
							commentsCount:
								postToDecrementComment.commentsCount - 1
						},
						{ where: { id: postToDecrementComment.id } }
					);
				}
			}
			const parentPostOfRepost = await PostRepost.findOne({
				where: { repostId: postId }
			});
			if (parentPostOfRepost) {
				const postToDecrementRepost = await Post.findByPk(
					parentPostOfRepost.postId
				);
				if (postToDecrementRepost) {
					await Post.update(
						{
							repostCount: postToDecrementRepost.repostCount - 1
						},
						{ where: { id: postToDecrementRepost.id } }
					);
				}
			}
			await Post.destroy({ where: { id: postId } });
		};
		await Promise.all(
			postsByUserId.map(async (postsByUserId) => {
				await handleParentPostOfCommentAndRepost(postsByUserId.id);
			})
		);
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
