'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true
				}
			},
			passwordDigest: {
				type: Sequelize.STRING,
				allowNull: false
			},
			profilePic: {
				type: Sequelize.TEXT
			},
			coverPhoto: {
				type: Sequelize.TEXT
			},
			bio: {
				type: Sequelize.TEXT
			},
			dateOfBirth: {
				type: Sequelize.DATE
			},
			followerCount: {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			followingCount: {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('users');
	}
};
