const Joi = require("joi");

const joiRegisterValidation = (user) => {
	const urlRegex =
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

	const schema = Joi.object({
		name: Joi.object()
			.keys({
				first: Joi.string().min(2).max(256).required(),
				middle: Joi.string().min(2).max(256).allow(""),
				last: Joi.string().min(2).max(256).required(),
			})
			.required(),
		phone: Joi.string()
			.ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
			.rule({ message: "Phone number is not valid." })
			.required(),
		email: Joi.string()
			.ruleset.pattern(
				/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
			)
			.rule({ message: "Email is not valid." })
			.required(),
		password: Joi.string()
			.min(7)
			.max(20)
			.ruleset.regex(
				/((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/
			)
			.rule({
				message:
					"Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-).",
			})
			.required(),
		image: Joi.object().keys({
			url: Joi.string()
				.min(14)
				.ruleset.regex(urlRegex)
				.rule({ message: "Image URL is not valid." })
				.allow(""),
			alt: Joi.string().min(2).max(256).allow(""),
		}),
		address: Joi.object()
			.keys({
				state: Joi.string().min(2).max(256).allow(""),
				country: Joi.string().min(2).max(256).required(),
				city: Joi.string().min(2).max(256).required(),
				street: Joi.string().min(2).max(256).required(),
				houseNumber: Joi.number().required(),
				zip: Joi.number().required(),
			})
			.required(),
		isBusiness: Joi.boolean().required(),
		isAdmin: Joi.boolean().allow(""),
	});
	return schema.validate(user);
};

module.exports = joiRegisterValidation;
