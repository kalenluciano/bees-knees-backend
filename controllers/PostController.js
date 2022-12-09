const { Post, PostReaction } = require('../models');

const GetAllPosts = async (req, res) => {
	try {
		const allPosts = await Post.findAll({});
		res.send(allPosts);
	} catch (error) {
		throw error;
	}
};

const GetPostsByUserId = async (req, res) => {
	try {
		const userId = parseInt(req.params.id);
		const postsByUserId = await Post.findAll({
			where: { userId },
			returning: true
		});
		const postReactions = await PostReaction.findAll({
			where: { userId },
			returning: true
		});
		const userPostsAndReactions = postsByUserId.map((post) => {
			const userReactionToPost = postReactions.filter((postReaction) => {
				post.id === postReaction.postId;
			});
			console.log({ ...post, reactionId: userReactionToPost });
			return {
				...post.dataValues,
				reactionId: userReactionToPost[0]?.reactionId
			};
		});
		res.send(userPostsAndReactions);
	} catch (error) {
		throw error;
	}
};

module.exports = {
	GetAllPosts,
	GetPostsByUserId
};
