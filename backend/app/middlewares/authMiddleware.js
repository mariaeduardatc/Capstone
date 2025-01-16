const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { UnauthorizedError } = require('../utils/errors');
const CONFIG = require('../config/config');
const User = require('../models/userModel');

const cookieJwtExtractor = function (req) {
    let token = null;
    if (req.headers.cookie) {
        // comment for future me: maybe this approach wont be the best parser if i want to extract lots of info from the cookies
        token = req.headers.cookie.split('=')[1];
    }
    return token;
}

const jwtOptions = {
    secretOrKey: CONFIG.API.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieJwtExtractor]),
    algorithms: ['HS256'],
    jsonWebTokenOptions: { maxAge: "1d" },
    passReqToCallback: false
}

const UserModel = new User();
const verifyCallback = async function (jwtPayload, done) {
    const userEmail = (jwtPayload.sub) ? jwtPayload.sub : '';
    try {
        const userObject = await UserModel.retrieveUserObjByEmail(userEmail);
        if (!userObject) { done(null, false); }
        done(null, userObject);
    } catch (err) {
        done(err, false);
    }
}

const jwtStrategy = new JwtStrategy(jwtOptions, verifyCallback);
function authenticateRequest(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, _info) => {
        if (err) { return next(err); }
        if (!user) { return next(new UnauthorizedError("Unauthorized.")); }
        return next();
    })(req, res, next);
}

module.exports = {
    authenticateRequest,
    cookieJwtExtractor,
    jwtStrategy,
}
