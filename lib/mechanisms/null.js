var debug = require('debug')('zmq-zap:null');

var NullMechanism = function(handler) {
	this.name = "NULL";
	
	if (!handler || (typeof handler !== 'function')) throw new Error("Invalid handler");
	this._handler = handler;
}

NullMechanism.prototype.validate = function(req) {
	if (!req) {
		return false;
	} else if (req.credentials && req.credentials.length) {
		/* istanbul ignore next */
		debug('Credentials should be empty; Invalid credential data: %s', req.credentials ? JSON.stringify(req.credentials, true, 2) : 'undefined');
		return false;
	}
	return true;
}

NullMechanism.prototype.authenticate = function(req, callback) {
	this._handler({
		domain: req.domain,
		address: req.address
	}, callback);
}

module.exports = NullMechanism;
