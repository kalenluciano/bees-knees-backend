'use strict';
const User = require('../models/user');
const Post = require('../models/post');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const users = await User.findAll({ raw: true });
		const posts = await Post.findAll({ raw: true });
		const reactions = [...Array(100)].map(() => ({
			userId: users[Math.floor(Math.random() * users.length)].id,
			postId: posts[Math.floor(Math.random() * posts.length)].id,
			reactionId: Math.floor(Math.random() * 2),
			createdAt: new Date(),
			updatedAt: new Date()
		}));
		await queryInterface.bulkInsert('post_reactions', reactions, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('post_reactions');
	}
};
