var mongoose = require('mongoose');

var connectDB = function() {
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

module.exports = connectDB;
