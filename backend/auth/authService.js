const { handleError, createError } = require("../utils/handleErrors");
const { verifyAuthToken } = require("./providers/jwt");
const config = require("config");

const tokenGenerator = config.get("TOKEN_GENERATOR");

const auth = (req, res, next) => {
	if (tokenGenerator === "jwt") {
		try {
			const tokenFromClient = req.header("x-auth-token");

			if (!tokenFromClient) {
				// The original way: throw new Error("Authentication Error: No token provided.");
				// If we have centered the error handling in one place, we can use the following:
				const error = new Error("Please Login.");
				error.status = 401;
				return createError("Authentication", error);
			}

			const userInfo = verifyAuthToken(tokenFromClient);
			if (!userInfo) {
				const error = new Error(" Unauthorized user.");
				error.status = 401;
				return createError("Authentication", error);
			}

			req.user = userInfo;
			return next();
		} catch (error) {
			return handleError(res, 401, error.message);
		}
	}

	return handleError(
		res,
		500,
		"Authentication Error: No authentication method found."
	);
};

module.exports = auth;
