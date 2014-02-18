var should = require('should'),
	zmqzap = require('../../'),
	z85 = require('z85'),
	util = require('./util');

module.exports = function() {
	util.validateMechanism(zmqzap.CurveMechanism);
	it('should invalidate a message with no credentials', function() {
		(function() {
			var mechanism = new zmqzap.CurveMechanism(util.noCallAuthenticator);
			mechanism.validate({}).should.not.be.ok;
		}).should.not.throw();
	});
	it("should invalidate a message with credentials who's length is not 1", function() {
		(function() {
			var mechanism = new zmqzap.CurveMechanism(util.noCallAuthenticator);
			mechanism.validate({credentials: []}).should.not.be.ok;
		}).should.not.throw();
	});
	it("should validate a message with credentials of length 1", function() {
		(function() {
			var mechanism = new zmqzap.CurveMechanism(util.noCallAuthenticator);
			mechanism.validate({credentials: [1]}).should.be.ok;
		}).should.not.throw();
	});
	it("should not throw when instanciated with options", function() {
		(function() {
			var mechanism = new zmqzap.CurveMechanism({}, util.noCallAuthenticator);
		}).should.not.throw();
	});
	it('should pass domain, address, and publickey to the authenticator (not z85 encoded)', function(done) {
		(function() {
			var mechanism = new zmqzap.CurveMechanism({z85Encode: false}, function(data, callback) {
				should.exist(data);
				should.exist(data.domain);
				data.domain.should.eql("abc")
				should.exist(data.address);
				data.address.should.eql("127.0.0.1");
				should.exist(data.publickey);
				data.publickey.should.eql([0x42]);
				done();
			});
			mechanism.authenticate({domain: "abc", address: "127.0.0.1", credentials: [[0x42]]});
		}).should.not.throw();
	});
	it('should pass domain, address, and publickey to the authenticator (z85 encoded)', function(done) {
		(function() {
			var mechanism = new zmqzap.CurveMechanism(function(data, callback) {
				should.exist(data);
				should.exist(data.domain);
				data.domain.should.eql("abc")
				should.exist(data.address);
				data.address.should.eql("127.0.0.1");
				should.exist(data.publickey);
				data.publickey.should.eql("abcde");
				done();
			});
			mechanism.authenticate({domain: "abc", address: "127.0.0.1", credentials: [z85.decode('abcde')]});
		}).should.not.throw();
	});
}
