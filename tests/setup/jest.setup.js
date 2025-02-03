var mongoose = require('mongoose');

beforeEach(function(done) {
    mongoose.connection.db.collections()
        .then(function(collections) {
            return Promise.all(
                collections.map(function(collection) {
                    return collection.deleteMany({});
                })
            );
        })
        .then(function() {
            done();
        });
});

afterAll(function(done) {
    mongoose.connection.close()
        .then(function() {
            done();
        });
}); 