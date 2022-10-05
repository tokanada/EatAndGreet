const express = require("express");
const app = express();

const userController = require("../controllers/user.controller");

app.post("/add_user", userController.addUser);

app.get("/users", userController.listCurrentUsers);

module.exports = app;