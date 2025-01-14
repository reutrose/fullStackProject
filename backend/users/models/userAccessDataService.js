const { generateAuthToken } = require("../../auth/providers/jwt");
const { createError } = require("../../utils/handleErrors");
const { generatePassword, comparePassword } = require("../helpers/bcrypt");
const User = require("./mongodb/User");

// User Register
const registerUser = async (newUser) => {
	try {
		newUser.password = generatePassword(newUser.password);
		let user = new User(newUser);
		user = await user.save();
		user = {
			name: {
				first: user.name.first,
				middle: user.name.middle,
				last: user.name.last,
			},
			phone: user.phone,
			email: user.email,
			image: { url: user.image.url, alt: user.image.alt },
			address: {
				state: user.address.state,
				country: user.address.country,
				city: user.address.city,
				street: user.address.street,
				houseNumber: user.address.houseNumber,
				zip: user.address.zip,
			},
			isBusiness: user.isBusiness,
		};
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

// Get User by ID
const getUser = async (userId) => {
	try {
		let user = await User.findById(userId);
		user = {
			name: {
				first: user.name.first,
				middle: user.name.middle,
				last: user.name.last,
			},
			phone: user.phone,
			email: user.email,
			image: { url: user.image.url, alt: user.image.alt },
			address: {
				state: user.address.state,
				country: user.address.country,
				city: user.address.city,
				street: user.address.street,
				houseNumber: user.address.houseNumber,
				zip: user.address.zip,
			},
			isBusiness: user.isBusiness,
			createdAt: user.createdAt,
		};
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

// User Login
const login = async (email, password) => {
	try {
		const userFromBD = await User.findOne({ email });
		if (!userFromBD) {
			const error = new Error("User not exist, Please register.");
			error.status = 401;
			createError("Authentication", error);
		}
		if (!comparePassword(password, userFromBD.password)) {
			const error = new Error("Password missmatch.");
			error.status = 401;
			createError("Authentication", error);
		}
		const token = generateAuthToken(userFromBD);
		return token;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

// Get All Users
const getAllUsers = async () => {
	try {
		let users = await User.find();
		return users;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

// Update User
const updateUser = async (userId, updatedData) => {
	try {
		let user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

// Delete User
const deleteUser = async (userId) => {
	try {
		let user = await User.findByIdAndDelete(userId);
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

// Change User Type
const changeUserType = async (userId) => {
	try {
		let user = await User.findById(userId);
		user.isBusiness = !user.isBusiness;
		user = await user.save();
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

module.exports = {
	registerUser,
	getUser,
	login,
	getAllUsers,
	updateUser,
	deleteUser,
	changeUserType,
};
