var should = require('should'),
	zmqzap = require('../../');

module.exports = function() {
	it('should respond with an error when called with an undefined message', function(done) {
		var zap = new zmqzap.ZAP();
		zap.use({
			name: 'test',
			authenticate: function(data, callback) {
				throw new Error("TestMechanism.authenticate() should not be called");
			}
		});
		(function() {
			zap.authenticate(null, function(err, response) {
				should.exist(err);
				err.should.be.an.Error;
				err.message.should.eql('Invalid Message');
				done();
			});
		}).should.not.throw();
	});
	it('should response with an error when called with an empty message', function(done) {
		var zap = new zmqzap.ZAP();
		zap.use({
			name: 'test',
			authenticate: function(data, callback) {
				throw new Error("TestMechanism.authenticate() should not be called");
			}
		});
		(function() {
			zap.authenticate([], function(err, response) {
				should.exist(err);
				err.should.be.an.Error;
				err.message.should.eql('Invalid Message');
				done();
			});
		}).should.not.throw();
	});
}
