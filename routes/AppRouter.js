const Router = require('express').Router();
const AuthRouter = require('./AuthRouter');
const UserRouter = require('./UserRouter');

Router.use('/auth', AuthRouter);
Router.use('/users', UserRouter);

module.exports = Router;
