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
		database: 'bees_knees_production',
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				rejectUnauthorized: false,
				require: true
			}
		}
	}
};
