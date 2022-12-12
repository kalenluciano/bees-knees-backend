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
			Post.belongsTo(models.User, {
				foreignKey: 'userId',
				as: 'user'
			});

			Post.belongsToMany(models.User, {
				as: 'user_reactions',
				through: models.PostReaction,
				foreignKey: 'postId'
			});

			Post.belongsToMany(models.Post, {
				as: 'reposts',
				through: models.PostRepost,
				foreignKey: 'postId'
			});

			Post.belongsToMany(models.Post, {
				as: 'repost_parent',
				through: models.PostRepost,
				foreignKey: 'repostId'
			});

			Post.belongsToMany(models.Post, {
				as: 'comments',
				through: models.PostComment,
				foreignKey: 'postId'
			});

			Post.belongsToMany(models.Post, {
				as: 'comment_parent',
				through: models.PostComment,
				foreignKey: 'commentId'
			});
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
