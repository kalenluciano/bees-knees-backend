const Router = require('express').Router();
const controller = require('../controllers/PostController');
const middleware = require('../middleware');

Router.get(
	'/all/user/:id',
	controller.GetAllPosts,
	controller.AddUserReactionsAndReposts
);
Router.get(
	'/user/:id',
	controller.GetPostsByUserId,
	controller.AddUserReactionsAndReposts
);
Router.get(
	'/followed-users/user/:id',
	controller.GetUserFollowingPosts,
	controller.AddUserReactionsAndReposts
);
Router.get(
	'/:postId/user/:userId',
	controller.GetPostDetailsById,
	controller.RecursivelyAddUserReactionsAndReposts
);
Router.get('/:postId/user/:userId', controller.GetPostById);
Router.post(
	'/',
	middleware.stripToken,
	middleware.verifyToken,
	controller.PostAPost
);
Router.post(
	'/comment/:postId',
	middleware.stripToken,
	middleware.verifyToken,
	controller.PostAComment
);
Router.post(
	'/repost/:postId',
	middleware.stripToken,
	middleware.verifyToken,
	controller.PostARepost
);
Router.post(
	'/reaction/:postId',
	middleware.stripToken,
	middleware.verifyToken,
	controller.PostAReaction
);
Router.put(
	'/:postId',
	middleware.stripToken,
	middleware.verifyToken,
	controller.UpdatePostById
);
Router.delete(
	'/post/:postId',
	middleware.stripToken,
	middleware.verifyToken,
	controller.DeletePost
);
Router.delete(
	'/:postId/reaction/:reactionId/user/:userId',
	middleware.stripToken,
	middleware.verifyToken,
	controller.DeleteReaction
);

module.exports = Router;
