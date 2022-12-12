const Router = require('express').Router();
const controller = require('../controllers/UserController');
const middleware = require('../middleware');

Router.get('/', controller.GetAllUsers);
Router.get('/:id', controller.GetUserDetailsById);
Router.get('/:userId/followed-user/:followedId', controller.CheckFollowStatus);
Router.post(
	'/:userId/followed-user/:followedId',
	middleware.stripToken,
	middleware.verifyToken,
	controller.AddToFollowingCount,
	controller.AddToFollowerCount,
	controller.FollowAUser
);
Router.put(
	'/:id',
	middleware.stripToken,
	middleware.verifyToken,
	controller.UpdateUserById
);
Router.delete(
	'/:id',
	middleware.stripToken,
	middleware.verifyToken,
	controller.DeleteUserById
);

module.exports = Router;
