var should = require('should'),
	zmqzap = require('../../');

module.exports = function() {
	it('should throw when called with an undefined mechanism', function() {
		var zap = new zmqzap.ZAP();
		(function() {
			zap.use();
		}).should.throw('Invalid mechanism');
	});
	it('should throw when called with an unnamed mechanism', function() {
		var zap = new zmqzap.ZAP();
		(function() {
			zap.use({});
		}).should.throw('Invalid mechanism name');
	})
	it("should throw when called with a mechanism that doesn't have an authenticate method", function() {
		var zap = new zmqzap.ZAP();
		(function() {
			zap.use({name: 'test'});
		}).should.throw('Invalid mechanism authenticate handler');
	});
	it("should not throw when called with a valid mechanism", function() {
		var zap = new zmqzap.ZAP();
		(function() {
			zap.use({
				name: 'test',
				authenticate: function() {}
			});
		}).should.not.throw();
	});
}
