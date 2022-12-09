const Router = require('express').Router();
const controller = require('../controllers/AuthController');
const middleware = require('../middleware');

Router.post('/register', controller.Register);
Router.post('/login', controller.Login);
Router.get(
	'/session',
	middleware.stripToken,
	middleware.verifyToken,
	controller.CheckSession
);

module.exports = Router;
