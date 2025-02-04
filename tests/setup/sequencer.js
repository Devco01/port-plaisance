var Sequencer = require('@jest/test-sequencer').default;

var CustomSequencer = function() {};
CustomSequencer.prototype = new Sequencer();

CustomSequencer.prototype.sort = function(tests) {
    return Array.from(tests).sort(function(testA, testB) {
        if (testA.path.includes('setup.js')) return -1;
        if (testB.path.includes('setup.js')) return 1;
        return 0;
    });
};

module.exports = CustomSequencer; 