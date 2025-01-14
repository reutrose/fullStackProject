const chalk = require("chalk");

const createError = (validator, error) => {
	error.message = `${validator} Error: ${error.message}`;
	error.status = error.status || 400;
	throw new Error(error);
};

const handleError = (res, status, message = "") => {
	console.log(chalk.bgYellowBright.red(message));
	return res.status(status).send(message);
};

module.exports = { createError, handleError };

// HTTP response status code:
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
