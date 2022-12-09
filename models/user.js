'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			User.hasMany(models.Post, {
				foreignKey: 'userId'
			});

			User.belongsToMany(models.Post, {
				as: 'user_reactions',
				through: models.PostReaction,
				foreignKey: 'userId'
			});

			User.belongsToMany(models.User, {
				as: 'followers',
				through: models.Follow,
				foreignKey: 'userId'
			});

			User.belongsToMany(models.User, {
				as: 'following',
				through: models.Follow,
				foreignKey: 'followerId'
			});
		}
	}
	User.init(
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true
				}
			},
			passwordDigest: {
				type: DataTypes.STRING,
				allowNull: false
			},
			profilePic: DataTypes.TEXT,
			coverPhoto: DataTypes.TEXT,
			bio: DataTypes.TEXT,
			dateOfBirth: DataTypes.DATE
		},
		{
			sequelize,
			modelName: 'User',
			tableName: 'users'
		}
	);
	return User;
};
