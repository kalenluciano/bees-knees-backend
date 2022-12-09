'use strict';
const { Post } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const posts = await Post.findAll({ raw: true });
		const reposts = [...Array(100)].map(() => ({
			postId: posts[Math.floor(Math.random() * posts.length)].id,
			repostId: posts[Math.floor(Math.random() * posts.length)].id,
			createdAt: new Date(),
			updatedAt: new Date()
		}));
		await queryInterface.bulkInsert('post_reposts', reposts, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('post_reposts');
	}
};
