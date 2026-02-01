const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_SECRET = process.env.JWT_SECRET_KEY;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET_KEY;
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '30m';

// Verify access token
module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        res.locals.userId = decoded.user_id;
        res.locals.username = decoded.username;
        next();
    });
};


// Generate new access token
module.exports.generateToken = (req, res, next) => {
    const payload = {
        user_id: res.locals.userId,
        username: res.locals.username
    };

    const token = jwt.sign(payload, ACCESS_SECRET, { 
        algorithm: 'HS256', 
        expiresIn: ACCESS_EXPIRES 
    });

    res.locals.token = token;
    next();
};

// Generate refresh token
module.exports.generateRefreshToken = (req, res, next) => {
    const payload = {
        user_id: res.locals.userId,
        username: res.locals.username
    };

    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { 
        algorithm: 'HS256', 
        expiresIn: REFRESH_EXPIRES 
    });

    res.locals.refreshToken = refreshToken;
    next();
};

// Send tokens in response
module.exports.sendToken = (req, res) => {
    res.status(200).json({
        accessToken: res.locals.token,
        refreshToken: res.locals.refreshToken
    });
};

// Refresh token route
module.exports.refreshToken = (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });
        res.locals.userId = user.user_id;
        res.locals.username = user.username;
        next();
    });
};
