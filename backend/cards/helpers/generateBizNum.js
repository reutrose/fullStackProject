const { handleError, createError } = require("../../utils/handleErrors");
const Card = require("../models/mongodb/Card");
const _ = require("lodash");

// const generateBizNum = async () => {
// 	let cardCount = await Card.countDocuments();
// 	if (cardCount === 8_999_999) {
// 		const error = new Error("Maximum amount of cards reached.");
//		error.status = 507;
//		return createError("Mongoose", error);
// 	}
// 	let random = _.random(1_000_000, 9_999_999);
// 	return bizNumExists(random) ? generateBizNum() : random;
// };

const generateBizNum = async () => {
	let cardCount = await Card.countDocuments();
	if (cardCount === 8_999_999) {
		const error = new Error("Maximum amount of cards reached.");
		error.status = 507;
		return createError("Mongoose", error);
	}
	let random;
	do {
		random = _.random(1_000_000, 9_999_999);
	} while (await bizNumExists(random));
	return random;
};

const bizNumExists = async (bizNum) => {
	try {
		const check = await Card.findOne({ bizNum });
		return Boolean(check);
	} catch (error) {
		error.status = 500;
		createError("Mongoose" + error);
	}
};

module.exports = generateBizNum;
