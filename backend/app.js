const express = require("express");
const connectToDB = require("./DB/dbService");
const router = require("./router/router");
const corsMiddleware = require("./middlewares/cors");
const { handleError } = require("./utils/handleErrors");
const chalk = require("chalk");
const { loggerMiddleware } = require("./logger/loggerService");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8182;

app.use(corsMiddleware);

app.use(express.json());

app.use(express.static("./public"));

app.use(loggerMiddleware());

// app.get("/password", (req, res) => {
// 	const myPassword = process.env.MY_PASSWORD;
// 	res.send(myPassword);
// });

app.use(router);

app.use((err, req, res, next) => {
	handleError(res, 500, "Internal Server error.");
});

app.listen(PORT, () => {
	console.log(chalk.bgGreen.black("Server listening to port " + PORT));
	connectToDB();
});
