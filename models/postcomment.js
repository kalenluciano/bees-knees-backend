'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class PostComment extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	PostComment.init(
		{
			postId: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'posts',
					key: 'id'
				}
			},
			commentId: {
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
			modelName: 'PostComment',
			tableName: 'post_comments'
		}
	);
	return PostComment;
};
