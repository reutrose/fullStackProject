const express = require("express");

const {
	createCard,
	getCards,
	getCard,
	getMyCards,
	updateCard,
	likeCard,
	deleteCard,
} = require("../models/cardAccessDataService");
const auth = require("../../auth/authService");
const normalizeCard = require("../helpers/normalize");
const { handleError } = require("../../utils/handleErrors");
const joiValidateCard = require("../validation/joi/joiValidationCard");
const validateCard = require("../validation/cardValidationService");
const router = express.Router();

// Create Card
router.post("/", auth, async (req, res) => {
	try {
		const userInfo = req.user;
		if (!userInfo.isBusiness) {
			// The original way: return res.status(403).send("Only business users can create new cards.");
			// If we have centered the error handling in one place, we can use the following:
			return handleError(res, 403, "Only business users can create new cards.");
		}
		const validationError = validateCard(req.body);
		if (validationError !== null) {
			return handleError(res, 400, "Validation Error: " + validationError);
		}
		let card = await normalizeCard(req.body, userInfo._id);
		card = await createCard(card);
		res.status(201).send(card);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

// Get All Cards
router.get("/", async (req, res) => {
	try {
		let cards = await getCards();
		res.send(cards);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

// Get My Cards
router.get("/my-cards", auth, async (req, res) => {
	try {
		const userInfo = req.user;
		if (!userInfo.isBusiness) {
			return handleError(res, 403, "Only business users can get their cards.");
		}
		let cards = await getMyCards(userInfo._id);
		res.send(cards);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

// Get Card by ID
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		let card = await getCard(id);
		res.send(card);
	} catch (error) {
		handleError(res, 400, error.message);
	}
});

// Update Card
router.put("/:id", auth, async (req, res) => {
	try {
		let userInfo = req.user;
		if (!userInfo.isBusiness && !userInfo.isAdmin) {
			return handleError(
				res,
				403,
				"Only business users can update their cards."
			);
		}
		const newCardDetails = req.body;
		const { id } = req.params;
		const originalCard = await getCard(id);
		if (!userInfo.isAdmin && originalCard.user_id != userInfo._id) {
			return handleError(
				res,
				403,
				"Only card owner or admin can update the card."
			);
		}
		if (!newCardDetails.user_id) {
			newCardDetails.user_id = originalCard.user_id;
		}
		if (!newCardDetails.bizNumber) {
			newCardDetails.bizNumber = originalCard.bizNumber;
		}
		let newCard = await normalizeCard(newCardDetails, userInfo._id);
		let card = await updateCard(id, newCard);
		res.send(card);
	} catch (error) {
		handleError(res, 400, error.message);
	}
});

// Like Card
router.patch("/:id", auth, async (req, res) => {
	try {
		let { id } = req.params;
		let userId = req.user._id;
		if (!userId) {
			return handleError(res, 403, "Only logged in users can like a card.");
		}
		let card = await likeCard(id, userId);
		res.send(card);
	} catch (error) {
		handleError(res, 400, error.message);
	}
});

// Delete Card
router.delete("/:id", auth, async (req, res) => {
	try {
		let { id } = req.params;
		let card = await getCard(id);
		let userInfo = req.user;
		if (!userInfo.isAdmin && card.user_id != userInfo._id) {
			return handleError(
				res,
				403,
				"Authorization Error: Only card owner or admin can delete the card."
			);
		}
		card = await deleteCard(id);
		res.send("DELETED: " + card);
	} catch (error) {
		handleError(res, 400, error.message);
	}
});

module.exports = router;
