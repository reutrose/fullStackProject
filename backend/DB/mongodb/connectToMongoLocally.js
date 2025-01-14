const chalk = require("chalk");
const mongoose = require("mongoose");

const connectToLocalDb = async () => {
	try {
		await mongoose.connect("mongodb://127.0.0.1:27017/cardsServer");
		console.log(chalk.bgWhite.green("Connected to MongoDB locally"));
	} catch (error) {
		console.error("Could not connect to MongoDB", error);
	}
};

module.exports = connectToLocalDb;
