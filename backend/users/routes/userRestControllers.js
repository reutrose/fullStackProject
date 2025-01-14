const express = require("express");
const {
	registerUser,
	getUser,
	login,
	changeUserType,
	getAllUsers,
	updateUser,
	deleteUser,
} = require("../models/userAccessDataService");
const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const { registerValidation } = require("../validation/userValidationService");
const { loginValidation } = require("../validation/userValidationService");
const normalizeUser = require("../helpers/normalize");

const router = express.Router();

// User Register
router.post("/", async (req, res) => {
	try {
		const validationError = registerValidation(req.body);
		if (validationError !== null) {
			return handleError(res, 400, "Validation Error: " + validationError);
		}
		let newUser = await normalizeUser(req.body);
		let user = await registerUser(newUser);
		res.send(user);
	} catch (error) {
		handleError(res, 400, error.message);
	}
});

// Get User by ID
router.get("/:id", auth, async (req, res) => {
	try {
		let userInfo = req.user;
		const { id } = req.params;
		if (userInfo._id != id && !userInfo.isAdmin) {
			return handleError(
				res,
				403,
				"Only admin users or the user itself are authorized to get the user details."
			);
		}
		let user = await getUser(id);
		res.send(user);
	} catch (error) {
		handleError(res, 400, error.message);
	}
});

// User Login
router.post("/login", async (req, res) => {
	try {
		const validationError = loginValidation(req.body);
		if (validationError !== null) {
			return handleError(res, 400, "Validation Error: " + validationError);
		}
		let { email, password } = req.body;
		let token = await login(email, password, false);
		res.send(token);
	} catch (error) {
		handleError(res, 400, error.message);
	}
});

// Get All Users
router.get("/", auth, async (req, res) => {
	try {
		let userInfo = req.user;
		if (!userInfo.isAdmin) {
			return handleError(res, 403, "Only Admin users can get all users.");
		}
		let users = await getAllUsers();
		res.send(users);
	} catch (error) {
		handleError(res, 400, error.message);
	}
});

// Update User
router.put("/:id", auth, async (req, res) => {
	try {
		let userInfo = req.user;
		const { id } = req.params;
		if (userInfo._id != id && !userInfo.isAdmin) {
			return handleError(
				res,
				403,
				"Only admin users or the user itself are authorized to update the user."
			);
		}
		let newUser = await normalizeUser(req.body);
		let user = await updateUser(id, newUser);
		res.send(user);
	} catch (error) {
		handleError(res, 400, error.message);
	}
});

// Delete User
router.delete("/:id", auth, async (req, res) => {
	try {
		let userInfo = req.user;
		const { id } = req.params;
		if (userInfo._id != id && !userInfo.isAdmin) {
			return handleError(
				res,
				403,
				"Only admin users or the user itself are authorized to delete the user."
			);
		}
		let user = await deleteUser(id);
		res.send("DELETED: " + user);
	} catch (error) {
		handleError(res, 400, error.message);
	}
});

// Change User Type
router.patch("/:id", auth, async (req, res) => {
	try {
		let userInfo = req.user;
		const { id } = req.params;
		let user = await getUser(id);
		if (userInfo._id != id && !userInfo.isAdmin) {
			return handleError(
				res,
				403,
				"Only admin users or the user itself are authorized to change user type."
			);
		}
		if (user.isAdmin) {
			return handleError(res, 403, "Admin user type can't be changed.");
		}
		let updatedUser = await changeUserType(id);
		res.send(updatedUser);
	} catch (error) {
		handleError(res, 400, error.message);
	}
});

module.exports = router;
