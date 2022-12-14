require('dotenv').config();
module.exports = {
	development: {
		database: 'bees_knees_development',
		dialect: 'postgres'
	},
	test: {
		database: 'bees_knees_test',
		dialect: 'postgres'
	},
	production: {
		use_env_variable: 'DATABASE_URL',
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				rejectUnauthorized: false,
				require: true
			}
		}
	}
};
