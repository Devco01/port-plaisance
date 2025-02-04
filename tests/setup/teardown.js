var mongoose = require('mongoose');

function teardown() {
    return new Promise(function(resolve, reject) {
        if (mongoose.connection.readyState !== 0) {
            mongoose.disconnect()
                .then(function() {
                    if (global.__MONGO_SERVER__) {
                        global.__MONGO_SERVER__.stop()
                            .then(function() {
                                delete global.__MONGO_SERVER__;
                                delete global.__MONGO_URI__;
                                resolve();
                            })
                            .catch(reject);
                    } else {
                        resolve();
                    }
                })
                .catch(reject);
        } else {
            resolve();
        }
    });
}

module.exports = teardown; 