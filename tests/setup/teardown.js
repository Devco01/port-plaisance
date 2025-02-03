var mongoose = require('mongoose');

module.exports = function() {
    return mongoose.disconnect()
        .then(function() {
            if (global.__MONGO_SERVER__) {
                return global.__MONGO_SERVER__.stop();
            }
        });
}; 