const jwt = require('jsonwebtoken');
const CONFIG = require('../../app/config/config');

function issueJwt(userEmail) {
    const payload = { 
        sub: userEmail, 
        iat: Date.now()
    };
    const jwtOptions = { 
        expiresIn: '1d', 
        algorithm: 'HS256' 
    };
    const signedToken = jwt.sign(payload, CONFIG.API.JWT_SECRET, jwtOptions);
    return signedToken;
}

function appendCookieJwt(res, userEmail) {
    const userJwt = issueJwt(userEmail);
    const cookieOptions = {
        expires: new Date(Date.now() + 3600000), 
        httpOnly: true,
        secure: true, 
        sameSite: 'None',
    };
    res.cookie('jwt', userJwt, cookieOptions);
    return res;
}

module.exports = {
    issueJwt,
    appendCookieJwt,
};
