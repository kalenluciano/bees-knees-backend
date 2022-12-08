'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Post.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'users',
					key: 'id'
				}
			},
			content: DataTypes.STRING,
			media: DataTypes.TEXT,
			commentsCount: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			},
			repostCount: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			},
			likesCount: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			},
			flagCount: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			}
		},
		{
			sequelize,
			modelName: 'Post',
			tableName: 'posts'
		}
	);
	return Post;
};
