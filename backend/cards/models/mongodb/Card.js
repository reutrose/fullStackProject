const { mongoose } = require("mongoose");
const {
	DEFAULT_VALIDATION,
	PHONE,
	EMAIL,
	URL,
} = require("../../../helpers/mongodb/mongooseValidators");
const Image = require("../../../helpers/mongodb/Image");
const Address = require("../../../helpers/mongodb/Address");

const cardSchema = new mongoose.Schema({
	title: DEFAULT_VALIDATION,
	subtitle: DEFAULT_VALIDATION,
	description: {
		...DEFAULT_VALIDATION,
		maxLength: 1024,
	},
	phone: PHONE,
	email: EMAIL,
	web: URL,
	image: Image,
	address: Address,
	bizNumber: {
		type: Number,
		required: true,
		min: 1000000,
		max: 9999999,
	},
	likes: [String],
	createAt: {
		type: Date,
		default: Date.now,
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
});

const Card = mongoose.model("card", cardSchema);

module.exports = Card;
