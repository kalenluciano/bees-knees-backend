const { User } = require('../models');
const middleware = require('../middleware');

const Login = async (req, res) => {
	try {
		const user = await User.findOne({
			where: { email: req.body.email },
			raw: true
		});
		if (
			user &&
			(await middleware.comparePassword(
				user.passwordDigest,
				req.body.password
			))
		) {
			let payload = {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName
			};
			let token = middleware.createToken(payload);
			return res.send({ user: payload, token });
		}
		res.status(401).send({ status: 'Error', msg: 'Unauthorized' });
	} catch (error) {
		throw error;
	}
};

const Register = async (req, res) => {
	try {
		const {
			email,
			password,
			firstName,
			lastName,
			username,
			profilePic,
			coverPhoto,
			bio,
			dateOfBirth
		} = req.body;
		let passwordDigest = await middleware.hashPassword(password);
		const user = await User.create({
			email,
			passwordDigest,
			firstName,
			lastName,
			username,
			profilePic,
			coverPhoto,
			bio,
			dateOfBirth
		});
		res.send(user);
	} catch (error) {
		throw error;
	}
};

const CheckSession = async (req, res) => {
	try {
		const { payload } = res.locals;
		res.send(payload);
	} catch (error) {
		throw error;
	}
};

module.exports = {
	Login,
	Register,
	CheckSession
};
