var should = require('should');

var noCallAuthenticator = module.exports.noCallAuthenticator = function(data, callback) {
	throw new Error("Authenticator should not be called");
}

module.exports.validAuthenticator = function(data, callback) {
	callback(null, true);
}

module.exports.invalidAuthenticator = function(data, callback) {
	callback(null, false);
}

module.exports.validateMechanism = function(mechanismConstructor) {
	it('should exist', function() {
		should.exist(mechanismConstructor);
	});
	it('should throw when instanciated without a handler', function() {
		(function() {
			var mechanism = new mechanismConstructor();
		}).should.throw();
	});
	it('should not throw when instanciated with a valid handler', function() {
		(function() {
			var mechanism = new mechanismConstructor(noCallAuthenticator);
		}).should.not.throw();
	});
	it('should have an authenticate function', function() {
		(function() {
			var mechanism = new mechanismConstructor(noCallAuthenticator);
			mechanism.authenticate.should.be.Function;
		}).should.not.throw();
	});
	it('should throw when authenticate is called with an invalid message', function() {
		(function() {
			var mechanism = new mechanismConstructor(noCallAuthenticator);
			mechanism.authenticate(null, function(err, user, message, metadata) {
				throw new Error("Authenticate callback should not be called")
			});
		}).should.throw();
	});	
	it('should invalidate a null message (if validator exists)', function() {
		(function() {
			var mechanism = new mechanismConstructor(noCallAuthenticator);
			if (mechanism.validate) {
				mechanism.validate.should.be.Function;
				mechanism.validate(null).should.not.be.ok;
			}
		}).should.not.throw();
	})
}
