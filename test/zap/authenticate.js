var should = require('should'),
	zmqzap = require('../../'),
	util = require('./util'),
	check = require('./check');

module.exports = function() {
	it('should respond with an error when called with an undefined message', function(done) {
		(function() {
			util.zap(null, util.noCallAuthenticator, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.none(req, res);
				done();
			})
		}).should.not.throw();
	});
	it('should respond with an error when called with a message with no frames', function(done) {
		(function() {
			util.zap([], util.noCallAuthenticator, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.none(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an error when called with an empty message', function(done) {
		(function() {
			util.zap(util.generateRequest(), util.noCallAuthenticator, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.none(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an error when called with a message with no version', function(done) {
		(function() {
			util.zap(util.generateRequest(null, null, "1"), util.noCallAuthenticator, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.none(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an error when called with a message with no requestId', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0"), util.noCallAuthenticator, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.none(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an error and response when called with a message with a valid version and requestId, but otherwise empty', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1"), util.noCallAuthenticator, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.invalidMessage(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an error and response when called with a message with an invalid address', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "abcd"), util.noCallAuthenticator, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.invalidMessage(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an error and response when called with an undefined mechanism', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "127.0.0.1"), util.noCallAuthenticator, function(err, res, req) {
				check.error.invalidMessage(err);
				check.response.invalidMessage(req, res);
				done();
			});
		}).should.not.throw();
	});
	it('should respond with an error and response when called with an invalid mechanism', function(done) {
		(function() {
			util.zap(util.generateRequest(null, "1.0", "1", null, "127.0.0.1", null, "NOPE"), util.noCallAuthenticator, function(err, res, req) {
				check.error.noAuthenticator(err);
				check.response.noAuthenticator(req, res);
				done();
			});
		}).should.not.throw();
	});
}
