var TestSequencer = require("@jest/test-sequencer").default;

/**
 * Séquenceur personnalisé pour l'exécution des tests
 * @constructor
 */
function CustomSequencer() {}

CustomSequencer.prototype = Object.create(TestSequencer.prototype);

/**
 * Détermine l'ordre d'exécution des tests
 * @param {Array} tests - Liste des tests à exécuter
 * @returns {Array} Tests ordonnés
 */
CustomSequencer.prototype.sort = function (tests) {
    var testOrder = [
        "config/db.test.js",
        "config/swagger.test.js",
        "unit/models",
        "unit/middleware",
        "integration"
    ];

    return tests.sort(function (testA, testB) {
        var indexA = getTestIndex(testA.path, testOrder);
        var indexB = getTestIndex(testB.path, testOrder);
        return indexA - indexB;
    });
};

/**
 * Obtient l'index d'un test dans l'ordre défini
 * @param {string} testPath - Chemin du fichier de test
 * @param {Array} order - Ordre d'exécution souhaité
 * @returns {number} Index du test
 */
function getTestIndex(testPath, order) {
    var index = 999;
    order.forEach(function (path, i) {
        if (testPath.includes(path)) {
            index = i;
        }
    });
    return index;
}

/**
 * Active le cache des résultats
 * @returns {CustomSequencer} Instance du séquenceur
 */
CustomSequencer.prototype.cacheResults = function () {
    return this;
};

module.exports = CustomSequencer;
