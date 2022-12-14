const {
	Follow,
	Post,
	PostReaction,
	PostComment,
	PostRepost,
	User
} = require('../models');

const GetAllPosts = async (req, res, next) => {
	try {
		const userId = parseInt(req.params.id);
		const allPosts = await Post.findAll({
			raw: true
		});
		res.locals.userId = userId;
		res.locals.posts = allPosts;
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const GetPostsByUserId = async (req, res, next) => {
	try {
		const userId = parseInt(req.params.id);
		const postsByUserId = await Post.findAll({
			where: { userId },
			raw: true
		});
		res.locals.userId = userId;
		res.locals.posts = postsByUserId;
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const GetUserFollowingPosts = async (req, res, next) => {
	try {
		const userId = parseInt(req.params.id);
		const allPosts = await Post.findAll({
			raw: true
		});
		const userFollowing = await Follow.findAll({
			where: { followerId: userId }
		});
		userFollowing.push({ userId });
		const userFollowingPosts = allPosts.filter((post) => {
			const postFilteredByUserFollowing = userFollowing.filter((user) => {
				return user.userId === post.userId;
			});
			return postFilteredByUserFollowing.length > 0;
		});
		res.locals.userId = userId;
		res.locals.posts = userFollowingPosts;
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const GetPostById = async (req, res, next) => {
	try {
		const userId = parseInt(req.params.userId);
		const postId = parseInt(req.params.postId);
		console.log(postId);
		console.log(userId);
		const post = await Post.findByPk(postId);
		const postReactions = await PostReaction.findOne({
			where: { userId, postId },
			raw: true
		});
		const postReposts = await Post.findAll({
			where: { postId, userId },
			include: [
				{
					model: Post,
					as: 'reposts',
					through: { attributes: [] }
				}
			]
		});
		const user = await User.findByPk(post.userId);
		const postToSend = {
			...post,
			reactionId: postReactions ? postReactions.reactionId : null,
			userReposted: postReposts.length >= 0 ? true : false,
			username: user.username
		};
		res.send(postToSend);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const AddUserReactionsAndReposts = async (req, res) => {
	try {
		const userId = res.locals.userId;
		const posts = res.locals.posts;
		const postReactions = await PostReaction.findAll({
			where: { userId },
			raw: true
		});
		const postsAndUserReactions = posts.map((post) => {
			const userReactionToPost = postReactions.filter((postReaction) => {
				return post.id === postReaction.postId;
			});
			return {
				...post,
				reactionId: userReactionToPost[0]
					? userReactionToPost[0].reactionId
					: null
			};
		});
		const postReposts = await Post.findAll({
			include: [
				{
					model: Post,
					as: 'reposts',
					through: { attributes: [] }
				}
			]
		});
		const postsAndUserReactionsAndReposts = postsAndUserReactions.map(
			(post) => {
				const repostsOfPost = postReposts.filter((postRepost) => {
					return post.id === postRepost.id;
				});
				if (repostsOfPost[0].reposts) {
					const userRepostOfPost = repostsOfPost[0].reposts.filter(
						(repost) => {
							return repost.userId === userId;
						}
					);
					return {
						...post,
						userReposted: userRepostOfPost[0] ? true : false
					};
				}
				return post;
			}
		);
		const allUsers = await User.findAll({});
		const postsUserDetailsAndUserReactionsAndReposts =
			postsAndUserReactionsAndReposts.map((post) => {
				const user = allUsers.filter((user) => {
					return user.id === post.userId;
				});
				return { ...post, username: user[0].username };
			});
		const sortedPostsUserDetailsAndUserReactionsAndReposts =
			postsUserDetailsAndUserReactionsAndReposts.sort((postA, postB) => {
				return postB.updatedAt - postA.updatedAt;
			});
		res.send(sortedPostsUserDetailsAndUserReactionsAndReposts);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const GetPostDetailsById = async (req, res, next) => {
	try {
		const userId = parseInt(req.params.userId);
		const postId = parseInt(req.params.postId);
		const postDetails = await Post.findOne({
			where: { id: postId },
			include: [
				{ model: Post, as: 'comments', through: { attributes: [] } }
			]
		});
		const getPostDetails = async (post) => {
			const postDetails = await Post.findOne({
				where: { id: post.id },
				include: [
					{
						model: Post,
						as: 'comments',
						through: { attributes: [] }
					}
				]
			});
			return postDetails;
		};
		const getAllComments = async (post) => {
			const postDetails = await getPostDetails(post);
			if (postDetails.comments.length === 0) {
				return postDetails;
			} else {
				return {
					...post.dataValues,
					comments: await Promise.all(
						postDetails.comments.map(
							async (comment) => await getAllComments(comment)
						)
					)
				};
			}
		};
		res.locals.posts = postDetails;
		if (postDetails) {
			const posts = {
				...postDetails.dataValues,
				comments: await Promise.all(
					postDetails.comments.map(
						async (comment) => await getAllComments(comment)
					)
				)
			};
			res.locals.posts = posts;
		}
		res.locals.userId = userId;
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const RecursivelyAddUserReactionsAndReposts = async (req, res) => {
	try {
		const userId = res.locals.userId;
		const posts = res.locals.posts;
		const postReactions = await PostReaction.findAll({
			where: { userId },
			raw: true
		});
		const postReposts = await Post.findAll({
			include: [
				{
					model: Post,
					as: 'reposts',
					through: { attributes: [] }
				}
			]
		});
		const allUsers = await User.findAll({});
		const addUserReactionsAndRepostToPosts = (post) => {
			const userReactionToPost = postReactions.filter((postReaction) => {
				return post.id === postReaction.postId;
			});
			const user = allUsers.filter((user) => {
				return user.id === post.userId;
			});
			const postAndUserReactions = {
				...post,
				reactionId: userReactionToPost[0]
					? userReactionToPost[0].reactionId
					: null,
				username: user[0].username
			};
			const repostsOfPost = postReposts.filter((postRepost) => {
				return postAndUserReactions.id === postRepost.id;
			});
			if (repostsOfPost[0].reposts) {
				const userRepostOfPost = repostsOfPost[0].reposts.filter(
					(repost) => {
						return repost.userId === userId;
					}
				);
				const postsAndUserReactionsAndReposts = {
					...postAndUserReactions,
					userReposted: userRepostOfPost[0] ? true : false
				};
				return postsAndUserReactionsAndReposts;
			}
			return postAndUserReactions;
		};
		const recursivelyAddUserReactionsAndReposts = (post) => {
			if (post.comments.length === 0) {
				return addUserReactionsAndRepostToPosts(
					post.dataValues ? post.dataValues : post
				);
			} else {
				return {
					...post,
					comments: post.comments.map((comment) =>
						recursivelyAddUserReactionsAndReposts(
							addUserReactionsAndRepostToPosts(
								comment.dataValues
									? comment.dataValues
									: comment
							)
						)
					)
				};
			}
		};
		res.send(
			recursivelyAddUserReactionsAndReposts(
				addUserReactionsAndRepostToPosts(posts)
			)
		);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const PostAReaction = async (req, res) => {
	try {
		const postId = parseInt(req.params.postId);
		const reaction = await PostReaction.create({ ...req.body, postId });
		const post = await Post.findByPk(postId);
		if (req.body.reactionId === 0) {
			const postUpdated = await Post.update(
				{ flagCount: post.flagCount + 1 },
				{ where: { id: postId } }
			);
			res.send({ reaction, postUpdated });
		} else {
			const postUpdated = await Post.update(
				{ likesCount: post.likesCount + 1 },
				{ where: { id: postId } }
			);
			res.send({ reaction, postUpdated });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const PostAComment = async (req, res) => {
	try {
		const postId = parseInt(req.params.postId);
		const comment = await Post.create(req.body);
		const commentRelationship = await PostComment.create({
			postId,
			commentId: comment.id
		});
		const commentIncrement = await Post.findByPk(postId);
		const incrementCommentCount = await Post.update(
			{
				commentsCount: commentIncrement.commentsCount + 1
			},
			{ where: { id: postId } }
		);
		res.send({ comment, commentRelationship, incrementCommentCount });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const PostARepost = async (req, res) => {
	try {
		const postId = parseInt(req.params.postId);
		const repost = await Post.create(req.body);
		const repostRelationship = await PostRepost.create({
			postId,
			repostId: repost.id
		});
		const postReposting = await Post.findByPk(postId);
		const incrementRepostCount = await Post.update(
			{
				repostCount: postReposting.repostCount + 1
			},
			{ where: { id: postId } }
		);
		res.send({ repost, repostRelationship, incrementRepostCount });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const PostAPost = async (req, res) => {
	try {
		const post = await Post.create(req.body);
		res.send(post);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const UpdatePostById = async (req, res) => {
	try {
		const postId = parseInt(req.params.postId);
		const post = await Post.update(req.body, {
			where: { id: postId },
			returning: true
		});
		res.send(post);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const DeletePost = async (req, res) => {
	try {
		const postId = parseInt(req.params.postId);
		const parentPostOfComment = await PostComment.findOne({
			where: { commentId: postId }
		});
		let postToDecrementComment;
		if (parentPostOfComment) {
			postToDecrementComment = await Post.findByPk(
				parentPostOfComment.postId
			);
			if (postToDecrementComment) {
				console.log(postToDecrementComment);
				const decrementCommentsCount = await Post.update(
					{
						commentsCount: postToDecrementComment.commentsCount - 1
					},
					{ where: { id: postToDecrementComment.id } }
				);
			}
		}
		const parentPostOfRepost = await PostRepost.findOne({
			where: { repostId: postId }
		});
		let postToDecrementRepost;
		if (parentPostOfRepost) {
			postToDecrementRepost = await Post.findByPk(
				parentPostOfRepost.postId
			);
			if (postToDecrementRepost) {
				const decrementRepostCount = await Post.update(
					{
						repostCount: postToDecrementRepost.repostCount - 1
					},
					{ where: { id: postToDecrementRepost.id } }
				);
			}
		}
		await Post.destroy({ where: { id: postId } });
		await PostReaction.destroy({ where: { postId: postId } });
		await PostComment.destroy({ where: { commentId: postId } });
		await PostRepost.destroy({ where: { repostId: postId } });
		res.status(200).send({ postToDecrementComment, postToDecrementRepost });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const DeleteReaction = async (req, res) => {
	try {
		const postId = parseInt(req.params.postId);
		const userId = parseInt(req.params.userId);
		const reactionId = parseInt(req.params.reactionId);
		const post = await Post.findByPk(postId);
		const reaction = await PostReaction.destroy({
			where: { postId, userId }
		});
		if (reactionId === 0) {
			await Post.update(
				{ flagCount: post.flagCount - 1 },
				{ where: { id: postId } }
			);
		} else {
			await Post.update(
				{ likesCount: post.likesCount - 1 },
				{ where: { id: postId } }
			);
		}
		return res.status(200).send({
			msg: `User with id ${reaction.userId} removed reaction to post with id ${reaction.postId}.`,
			payload: reaction
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

module.exports = {
	GetAllPosts,
	GetPostsByUserId,
	GetUserFollowingPosts,
	GetPostDetailsById,
	GetPostById,
	AddUserReactionsAndReposts,
	RecursivelyAddUserReactionsAndReposts,
	PostAReaction,
	PostAComment,
	PostARepost,
	PostAPost,
	UpdatePostById,
	DeletePost,
	DeleteReaction
};
