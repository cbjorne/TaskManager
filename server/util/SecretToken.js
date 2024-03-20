require('dotenv').config();
const jwt = require('jsonwebtoken');

const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports.createSecretToken = (id) => {
    return jwt.sign({ id }, TOKEN_KEY, {
        expiresIn: '2h'
    });
};