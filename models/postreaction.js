'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class PostReaction extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	PostReaction.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'users',
					key: 'id'
				}
			},
			postId: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'posts',
					key: 'id'
				}
			},
			reactionId: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: 'PostReaction',
			tableName: 'post_reactions'
		}
	);
	return PostReaction;
};
