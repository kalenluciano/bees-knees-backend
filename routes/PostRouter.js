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
Router.get('/:postId/user/:userId', controller.GetPostDetailsById);
Router.post(
	'/',
	middleware.stripToken,
	middleware.verifyToken,
	controller.PostAPost
);

module.exports = Router;
