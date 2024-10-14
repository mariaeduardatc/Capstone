const passport = require('passport');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');
const { UnauthorizedError } = require('../utils/errors');
const jwtUtils = require('../utils/jwt')

class UserController {
    constructor() {
        this.userModel = new UserModel();
    }

    processLogout = asyncHandler(async (req, res, _next) => {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        res.status(200).json({});
    });

    processAuthentication = asyncHandler(async (req, res, next) => {
        passport.authenticate('jwt', { session: false }, async (err, user, info) => {
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
        const registerResponse = await this.userModel.register(userInterface);
        jwtUtils.appendCookieJwt(res, registerResponse.email);
        res.status(200).json(registerResponse);
    });

    processLogin = asyncHandler(async (req, res) => {
        const userInterface = req.body;
        const loginResponse = await this.userModel.login(userInterface);
        jwtUtils.appendCookieJwt(res, loginResponse.email);
        res.status(200).json(loginResponse);
    });
}

module.exports = UserController;
