const Joi = require("joi");

const joiValidateCard = (card) => {
	const urlRegex =
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

	const schema = Joi.object({
		title: Joi.string().min(2).max(256).required(),
		subtitle: Joi.string().min(2).max(256).required(),
		description: Joi.string().min(2).max(1024).required(),
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
		web: Joi.string()
			.ruleset.regex(urlRegex)
			.rule({ message: "Web address is not valid." })
			.allow(""),
		image: Joi.object()
			.keys({
				url: Joi.string()
					.ruleset.regex(urlRegex)
					.rule({ message: "Image URL is not valid." })
					.allow(""),
				alt: Joi.string().min(2).max(256).allow(""),
			})
			.required(),
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
	});

	return schema.validate(card);
};

module.exports = joiValidateCard;
