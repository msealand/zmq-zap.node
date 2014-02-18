var should = require('should'),
	zmqzap = require('../../'),
	util = require('./util');

module.exports = function() {
	util.validateMechanism(zmqzap.PlainMechanism);
	it('should invalidate a message with no credentials', function() {
		(function() {
			var mechanism = new zmqzap.PlainMechanism(util.noCallAuthenticator);
			mechanism.validate({}).should.not.be.ok;
		}).should.not.throw();
	});
	it("should invalidate a message with credentials who's length is not 2", function() {
		(function() {
			var mechanism = new zmqzap.PlainMechanism(util.noCallAuthenticator);
			mechanism.validate({credentials: []}).should.not.be.ok;
		}).should.not.throw();
	});
	it("should validate a message with credentials of length 2", function() {
		(function() {
			var mechanism = new zmqzap.PlainMechanism(util.noCallAuthenticator);
			mechanism.validate({credentials: [1, 1]}).should.be.ok;
		}).should.not.throw();
	});
	it('should pass domain, address, username, and password to the authenticator', function(done) {
		(function() {
			var mechanism = new zmqzap.PlainMechanism(function(data, callback) {
				should.exist(data);
				should.exist(data.domain);
				data.domain.should.eql("abc")
				should.exist(data.address);
				data.address.should.eql("127.0.0.1");
				should.exist(data.username);
				data.username.should.eql("user");
				should.exist(data.password);
				data.password.should.eql("pass");
				done();
			});
			mechanism.authenticate({domain: "abc", address: "127.0.0.1", credentials: [new Buffer("user", "utf8"), new Buffer("pass", "utf8")]});
		}).should.not.throw();
	});
}
