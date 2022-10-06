const express = require("express");
const app = express();

const { body } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require("../models/user");
const userController = require("../controllers/user.controller");

app.post("/add_user", userController.addUser);

app.get("/users", userController.listCurrentUsers);

app.post("/login", [
    body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(value => {
        return User.findOne({ email: value }).then(foundUser => {
            if (!foundUser) {
                return Promise.reject("User not found. Please enter a valid email.");
            }
        })
    }),
    body("password")
    .notEmpty()
    .withMessage("Password field can't be empty")
    .custom(async(value, { req }) => {
        const user = await User.findOne({ email: req.body.email });
        const isEqual = await bcrypt.compare(value, user.password);
        if (!isEqual) {
            return Promise.reject("Incorrect password");
        }
    })
], userController.login);

app.get("/logout", userController.logout);

app.get("/user", userController.showCurrentUser);

module.exports = app;