var should = require('should'),
	zmqzap = require('../../'),
	util = require('./util'),
	check = require('./check');

module.exports = function() {
	it('should respond with an error when called with an undefined message', function(done) {
		(function() {
			util.zap(null, util.noCallAuthenticator, null, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.none(req, res);
				done();
			})
		}).should.not.throw();
	});
	it('should respond with an invalid message error when called with a message with no frames', function(done) {
		(function() {
			util.zap([], util.noCallAuthenticator, null, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.none(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an invalid message error when called with an empty message', function(done) {
		(function() {
			util.zap(util.generateRequest(), util.noCallAuthenticator, null, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.none(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an invalid message error when called with a message with no version', function(done) {
		(function() {
			util.zap(util.generateRequest(null, null, "1"), util.noCallAuthenticator, null, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.none(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an invalid message error when called with a message with no requestId', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0"), util.noCallAuthenticator, null, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.none(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an invalid message error and 300 response when called with a message with a valid version and requestId, but otherwise empty', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1"), util.noCallAuthenticator, null, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.invalidMessage(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an invalid message error and 300 response when called with a message with an invalid address', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "abcd"), util.noCallAuthenticator, null, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.invalidMessage(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an invalid message error and 300 response when called with an undefined mechanism', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "127.0.0.1"), util.noCallAuthenticator, null, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.invalidMessage(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an error and 300 response when the authenticator says the message is invalid', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "127.0.0.1", null, "TEST"), util.noCallAuthenticator, util.invalidValidator, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.invalidMessage(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with a no authenticator error and 500 response when called with an invalid mechanism', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "127.0.0.1", null, "NOPE"), util.noCallAuthenticator, null, function(err, res, req) {
				check.error.noAuthenticator(err);
				check.response.noAuthenticator(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an error and 500 response when the authenticator errors', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "127.0.0.1", null, "TEST"), util.errorAuthenticator, null, function(err, res, req) {
				check.error.general(err);
				check.response.generalError(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an error and 500 response when the authenticator errors (no message)', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "127.0.0.1", null, "TEST"), util.errorAuthenticatorWithNoMessage, null, function(err, res, req) {
				check.error.general(err);
				check.response.generalError(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with a 400 response when authentication fails', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "127.0.0.1", null, "TEST"), util.failureAuthenticator, null, function(err, res, req) {
				check.error.none(err);
				check.response.failure(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with a 200 response when authentication succeeds', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "127.0.0.1", null, "TEST"), util.successAuthenticator, null, function(err, res, req) {
				check.error.none(err);
				check.response.success(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with a 200 response with a userId when authentication succeeds and returns a userId (string)', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "127.0.0.1", null, "TEST"), util.successAuthenticatorWithUserIdString, null, function(err, res, req) {
				check.error.none(err);
				check.response.success(req, res, 12345);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with a 200 response with a userId when authentication succeeds and returns a userId (number)', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "127.0.0.1", null, "TEST"), util.successAuthenticatorWithNumericUserId, null, function(err, res, req) {
				check.error.none(err);
				check.response.success(req, res, 12345);
				done();
			});
		}).should.not.throw();
	});
	it('should have a return path in the response when responding to a valid message', function(done) {
		(function() {
			util.zap(util.generateRequest([0x32, 0x32, 0x32, 0x32], "1.0", "1", null, "127.0.0.1", null, "TEST"), util.successAuthenticator, util.validValidator, function(err, res, req) {
				check.error.none(err);
				check.response.successWithReturnPath(req, res);
				done();
			});
		}).should.not.throw();
	});
}
