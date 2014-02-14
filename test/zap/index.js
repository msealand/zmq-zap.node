var should = require('should'),
	zmqzap = require('../../');

module.exports = function() {
	it('should exist', function() {
		should.exist(zmqzap.ZAP);
	});
	describe('use()', require('./use'));
	describe('authenticate()', require('./authenticate'));
}
