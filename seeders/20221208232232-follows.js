'use strict';
const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const users = await User.findAll({ raw: true });
		const follows = [...Array(100)].map(() => ({
			userId: users[Math.floor(Math.random() * users.length)].id,
			followerId: users[Math.floor(Math.random() * users.length)].id,
			createdAt: new Date(),
			updatedAt: new Date()
		}));
		await queryInterface.bulkInsert('follows', follows, {});
	},

	async down(queryInterface, Sequelize) {
		queryInterface.bulkDelete('follows');
	}
};
