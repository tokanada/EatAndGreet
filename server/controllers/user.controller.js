require('dotenv').config();
const secret = process.env.SECRET;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require("../models/user");

exports.addUser = async(req, res) => {
    try {
        const hashedPW = bcrypt.hashSync(req.body.password, 12);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPW
        });

        await user.save();

        // Generate and Send RES with Cookie
        res.send(user);
    } catch (error) {
        const status = error.statuscode || 500;
        res.status(status).json({ error: error.data });
    }
}

exports.login = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = new Error('Validation failed');
            err.statusCode = 422;
            err.data = errors.array();
            throw err;
        }

        const user = await User.findOne({ email: req.body.email });
        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        }, secret, { expiresIn: '2h' });

        res.status(200)
            .cookie('token', token, { httpOnly: true })
            .json({
                message: "User Logged In"
            });
    } catch (error) {
        const status = error.statuscode || 500;
        res.status(status).json({ error: error.data });
    }
}

exports.logout = (req, res) => {
    res.status(200)
        .clearCookie('token')
        .json({
            message: "User logged out."
        })
}

exports.listCurrentUsers = async(req, res) => {
    const users = await User.find({});

    try {
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.showCurrentUser = async(req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(202).json({
                message: "No user logged in. Please log in."
            });
        }

        const decodedToken = jwt.verify(token, secret);
        if (!decodedToken) {
            return res.status(202).json({
                message: "Token no valid. Please log in."
            });
        }

        const user = await User.findById(decodedToken.userId);
        res.status(200).json({
            message: "User authenticated and logged in.",
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        const status = error.statuscode || 500;
        res.status(status).json({ error: error.data });
    }
}