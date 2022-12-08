'use strict';
const User = require('../models/user');
const Post = require('../models/post');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const users = await User.findAll({ raw: true });
		const posts = await Post.findAll({ raw: true });
	},

	async down(queryInterface, Sequelize) {}
};
