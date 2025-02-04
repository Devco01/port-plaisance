var jwt = require('jsonwebtoken');

var generateToken = function (userData) {
    return jwt.sign(userData, process.env.JWT_SECRET || 'test_secret', {
        expiresIn: '1h'
    });
};

module.exports = {
    generateToken: generateToken
};
