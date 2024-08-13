const jwt = require('jsonwebtoken')

const secret_key = "kartik vyas"

const createToken = (user) => {

    return jwt.sign({
        iat: Date.now(),
        _id: user._id
    }, secret_key, { expiresIn: '1h' });
};

const verifyToken = (token) => {

    return jwt.verify(token, secret_key)
}

module.exports = { createToken, verifyToken }