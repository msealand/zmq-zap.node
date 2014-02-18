var debug = require('debug')('zmq-zap:plain');

var PlainMechanism = function(handler) {
	this.name = "PLAIN";
	
	if (!handler || (typeof handler !== 'function')) throw new Error("Invalid handler");
	this._handler = handler;
}

PlainMechanism.prototype.validate = function(req) {
	if (!req) {
		return false;
	} else if (!req.credentials || (req.credentials.length != 2)) {
		/* istanbul ignore next */
		debug('Credentials should contain two entries; Invalid credential data: %s', req.credentials ? JSON.stringify(req.credentials, true, 2) : 'undefined');
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
	}, callback);
}

module.exports = PlainMechanism;
