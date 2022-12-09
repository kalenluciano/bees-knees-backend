const Router = require('express').Router();
const controller = require('../controllers/PostController');

Router.get('/', controller.GetAllPosts);
Router.get('/user/:id', controller.GetPostsByUserId);

module.exports = Router;
