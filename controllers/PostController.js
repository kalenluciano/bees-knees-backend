const { Post, PostReaction } = require('../models');

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
	AddUserReactionsAndReposts,
	PostAPost
};
