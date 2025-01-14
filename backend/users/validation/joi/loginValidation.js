const Joi = require("joi");

const joiLoginValidation = (user) => {
	const schema = Joi.object({
		email: Joi.string()
			.ruleset.pattern(
				/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
			)
			.rule({ message: "Email is not valid." })
			.required(),
		password: Joi.string().min(7).max(20).required(),
	});
	return schema.validate(user);
};

module.exports = joiLoginValidation;
