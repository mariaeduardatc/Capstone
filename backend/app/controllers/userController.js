const passport = require('passport');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');
const { UnauthorizedError } = require('../utils/errors');

class UserController {
    constructor() {
        this.userModel = new UserModel();
    }

    processLogout = asyncHandler(async (req, res) => {
        res.status(200).json({ message: "Successfully logged out." });
    });

    processAuthentication = asyncHandler(async (req, res, next) => {
        passport.authenticate('local', { session: false }, async (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new UnauthorizedError("Unauthorized."));
            }
            res.status(200).json(user);
        })(req, res, next);
    });

    processRegister = asyncHandler(async (req, res) => {
        const userInterface = req.body;
        console.log('Registering user:', userInterface);
        const registerResponse = await this.userModel.register(userInterface);
        res.status(200).json(registerResponse);
    });

    processLogin = asyncHandler(async (req, res) => {
        const userInterface = req.body;
        const loginResponse = await this.userModel.login(userInterface);
        res.status(200).json(loginResponse);
    });
}

module.exports = UserController;
