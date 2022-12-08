'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class PostRepost extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	PostRepost.init(
		{
			postId: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'posts',
					key: 'id'
				}
			},
			repostId: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'posts',
					key: 'id'
				}
			}
		},
		{
			sequelize,
			modelName: 'PostRepost',
			tableName: 'post_reposts'
		}
	);
	return PostRepost;
};
