var mongoose = require('mongoose');

var beforeAllFn = function() {
    return new Promise(function(resolve) {
        if (!mongoose.connection.readyState) {
            mongoose.connect(global.__MONGO_URI__)
                .then(function() { resolve(); });
        } else {
            resolve();
        }
    });
};

var afterAllFn = function() {
    return mongoose.disconnect();
};

var beforeEachFn = function() {
    return new Promise(function(resolve) {
        if (mongoose.connection.db) {
            mongoose.connection.db.collections()
                .then(function(collections) {
                    Promise.all(collections.map(function(collection) {
                        return collection.deleteMany({});
                    }))
                        .then(function() { resolve(); });
                });
        } else {
            resolve();
        }
    });
};

beforeAll(beforeAllFn);
afterAll(afterAllFn);
beforeEach(beforeEachFn); 