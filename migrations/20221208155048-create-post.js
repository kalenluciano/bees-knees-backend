'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('posts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			userId: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'users',
					key: 'id'
				}
			},
			content: {
				type: Sequelize.STRING
			},
			media: {
				type: Sequelize.TEXT
			},
			commentsCount: {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			repostCount: {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			likesCount: {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			flagCount: {
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
		await queryInterface.dropTable('posts');
	}
};
