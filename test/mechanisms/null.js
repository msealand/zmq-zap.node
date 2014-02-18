var should = require('should'),
	zmqzap = require('../../'),
	util = require('./util');

module.exports = function() {
	util.validateMechanism(zmqzap.NullMechanism);
	it('should invalidate a message with credentials of non-zero length', function() {
		(function() {
			var mechanism = new zmqzap.NullMechanism(util.noCallAuthenticator);
			mechanism.validate({credentials: [1]}).should.not.be.ok;
		}).should.not.throw();
	});
	it('should validate a message with no credentials', function() {
		(function() {
			var mechanism = new zmqzap.NullMechanism(util.noCallAuthenticator);
			mechanism.validate({}).should.be.ok;
		}).should.not.throw();
	});
	it('should pass domain and address to the authenticator', function(done) {
		(function() {
			var mechanism = new zmqzap.NullMechanism(function(data, callback) {
				should.exist(data);
				should.exist(data.domain);
				data.domain.should.eql("abc")
				should.exist(data.address);
				data.address.should.eql("127.0.0.1");
				done();
			});
			mechanism.authenticate({domain: "abc", address: "127.0.0.1"})
		}).should.not.throw();
	});
}
