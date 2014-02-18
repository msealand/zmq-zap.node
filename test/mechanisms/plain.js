var should = require('should'),
	zmqzap = require('../../'),
	util = require('./util');

module.exports = function() {
	util.validateMechanism(zmqzap.PlainMechanism);
}
