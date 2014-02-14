var should = require('should'),
	zmqzap = require('../../');

module.exports = function() {
	it('should exist', function() {
		should.exist(zmqzap.NullMechanism);
	});
	it('should throw when instanciated without a handler', function() {
		(function() {
			var mechanism = new zmqzap.NullMechanism();
		}).should.throw();
	});
}
