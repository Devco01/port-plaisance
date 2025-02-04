var mongoose = require("mongoose");

module.exports = function () {
    return mongoose.connection
        .close()
        .then(function () {
            return Promise.resolve();
        })
        .catch(function (err) {
            console.error("Erreur lors de la fermeture de la connexion:", err);
            return Promise.resolve();
        });
};
