'use strict';
const { Post } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const posts = await Post.findAll({ raw: true });
		const reposts = [...Array(50)].map((number, index) => ({
			postId: posts[index + 2].id,
			repostId: posts[index + 1].id,
			createdAt: new Date(),
			updatedAt: new Date()
		}));
		await queryInterface.bulkInsert('post_reposts', reposts, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('post_reposts');
	}
};
