var debug = require('debug')('zmq-zap:null');

var NullMechanism = function(handler) {
	this.name = "NULL";
	
	if (!handler || (typeof handler !== 'function')) throw new Error("Invalid handler");
	this._handler = handler;
}

NullMechanism.prototype.validate = function(req) {
	if (req.credentials && req.credentials.length) {
		debug('Credentials should be empty');
		debug('Invalid credential data: %s', req.credentials ? JSON.stringify(req.credentials, true, 2) : 'undefined');
		return false;
	}
	return true;
}

NullMechanism.prototype.authenticate = function(req, callback) {
	this._handler({
		domain: req.domain,
		address: req.address
	}, function(err, user, message, metadata) {
		callback(err, user, message, metadata);
	});
}

module.exports = NullMechanism;
