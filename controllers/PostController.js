const { Follow, Post, PostReaction } = require('../models');

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
		throw error;
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
		throw error;
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
		throw error;
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
				reactionId: userReactionToPost[0]?.reactionId
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
		res.send(postsAndUserReactionsAndReposts);
	} catch (error) {
		throw error;
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
					post,
					comments: await Promise.all(
						postDetails.comments.map(
							async (comment) => await getAllComments(comment)
						)
					)
				};
			}
		};
		const posts = {
			postDetails,
			comments: await Promise.all(
				postDetails.comments.map(
					async (comment) => await getAllComments(comment)
				)
			)
		};
		res.locals.userId = userId;
		res.locals.posts = posts;
		next();
	} catch (error) {
		throw error;
	}
};

const PostAPost = async (req, res) => {
	try {
		const post = await Post.create(req.body);
		res.send(post);
	} catch (error) {
		throw error;
	}
};

module.exports = {
	GetAllPosts,
	GetPostsByUserId,
	GetUserFollowingPosts,
	GetPostDetailsById,
	AddUserReactionsAndReposts,
	PostAPost
};
