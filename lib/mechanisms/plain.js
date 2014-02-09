var debug = require('debug')('zmq-zap:plain');

var PlainMechanism = function(handler) {
	if (!handler || (typeof handler !== 'function')) throw new Error("Invalid handler");
	this._handler = handler;
}

PlainMechanism.prototype.validate = function(req) {
	if (!req.credentials || (req.credentials.length != 2)) {
		debug('Credentials should contain two entries');
		debug('Invalid credential data: %s', req.credentials ? JSON.stringify(req.credentials, true, 2) : 'undefined');
		return false;
	}
	return true;
}

PlainMechanism.prototype.authenticate = function(req, callback) {
	var username = new Buffer(req.credentials[0]).toString('utf8'),
		password = new Buffer(req.credentials[1]).toString('utf8');
	
	this._handler({
		domain: req.domain,
		address: req.address,
		username: username,
		password: password
	}, function(err, user, message, metadata) {
		callback(err, user, message, metadata);
	});
}

module.exports = PlainMechanism;
