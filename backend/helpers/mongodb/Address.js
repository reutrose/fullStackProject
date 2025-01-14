const { mongoose } = require("mongoose");
const { DEFAULT_VALIDATION } = require("./mongooseValidators");

const Address = new mongoose.Schema({
	state: {
		type: String,
		trim: true,
		maxLength: 256,
	},
	country: DEFAULT_VALIDATION,
	city: DEFAULT_VALIDATION,
	street: DEFAULT_VALIDATION,
	houseNumber: {
		type: Number,
		required: true,
		min: 1,
	},
	zip: {
		type: Number,
		default: 0,
	},
});

module.exports = Address;
