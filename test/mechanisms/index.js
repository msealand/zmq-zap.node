var should = require('should');

module.exports = function() {
	describe('NullMechanism', require('./null'));
	describe('PlainMechanism', require('./plain'));
	describe('CurveMechanism', require('./curve'));
}
