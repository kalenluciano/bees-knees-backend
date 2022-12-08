'use strict';
const falso = require('@ngneat/falso');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const users = [...Array(100)].map(() => ({
			firstName: falso.randFirstName(),
			lastName: falso.randLastName(),
			username: falso.randUserName(),
			email: falso.randEmail(),
			passwordDigest: falso.randPassword(),
			profilePic: falso.randImg(),
			coverPhoto: falso.randImg(),
			bio: falso.randText(),
			dateOfBirth: falso.randPastDate({ years: 100 }),
			createdAt: new Date(),
			updatedAt: new Date()
		}));
		await queryInterface.bulkInsert('users', users, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('users');
	}
};
