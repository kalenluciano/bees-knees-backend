'use strict';
const { Post } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const posts = await Post.findAll({ raw: true });
		const comments = [...Array(90)].map((number, index) => ({
			postId: posts[index + 2].id,
			commentId: posts[index + 1].id,
			createdAt: new Date(),
			updatedAt: new Date()
		}));
		await queryInterface.bulkInsert('post_comments', comments, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('post_comments');
	}
};
