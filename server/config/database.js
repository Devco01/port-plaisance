var mongoose = require("mongoose");

var connection = null;

module.exports = {
    connect: function (uri) {
        if (connection) {
            return Promise.resolve(connection);
        }

        return mongoose
            .connect(
                uri ||
                    process.env.MONGODB_URI ||
                    "mongodb://localhost:27017/port-plaisance",
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }
            )
            .then(function (conn) {
                connection = conn;
                return connection;
            });
    },

    disconnect: function () {
        if (!connection) {
            return Promise.resolve();
        }
        return mongoose.connection.close().then(function () {
            connection = null;
        });
    },

    getConnection: function () {
        return connection;
    }
};
