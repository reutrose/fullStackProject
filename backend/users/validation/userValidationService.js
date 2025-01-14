const joiLoginValidation = require("./joi/loginValidation");
const joiRegisterValidation = require("./joi/registerValidation");
const config = require("config");

const validator = config.get("VALIDATOR");

const registerValidation = (user) => {
	if (validator === "Joi") {
		const { error } = joiRegisterValidation(user);
		if (error) return error.details[0].message;
		return null;
	}
};

const loginValidation = (user) => {
	if (validator === "Joi") {
		const { error } = joiLoginValidation(user);
		if (error) return error.details[0].message;
		return null;
	}
};

module.exports = {
	registerValidation,
	loginValidation,
};
