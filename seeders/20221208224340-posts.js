'use strict';
const falso = require('@ngneat/falso');
const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const users = await User.findAll({ raw: true });
		const posts = [...Array(100)].map(() => ({
			userId: users[Math.floor(Math.random() * users.length)].id,
			content: falso.randText(),
			media: falso.randImg(),
			createdAt: new Date(),
			updatedAt: new Date()
		}));
		await queryInterface.bulkInsert('posts', posts, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('posts');
	}
};
