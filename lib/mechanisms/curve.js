var debug = require('debug')('zmq-zap:curve'),
	z85 = require('z85');

var CurveMechanism = function(options, handler) {
	this.name = "CURVE";
	
	if (!handler) {
		handler = options;
		delete options;
	}
	
	if (!handler || (typeof handler !== 'function')) throw new Error("Invalid handler");
	this._handler = handler;
	this._z85Encode = (options || {}).z85Encode;
	
	if (typeof this._z85Encode === 'undefined') this._z85Encode = true;
}

CurveMechanism.z85Encode = z85.encode;
CurveMechanism.z85Decode = z85.decode;

CurveMechanism.prototype.validate = function(req) {
	if (!req) {
		return false;
	} else if (!req.credentials || (req.credentials.length != 1)) {
		/* istanbul ignore next */
		debug('Credentials should contain one entry; Invalid credential data: %s', req.credentials ? JSON.stringify(req.credentials, true, 2) : 'undefined');		debug('Invalid credential data');
		return false;
	}
	return true;
}

CurveMechanism.prototype.authenticate = function(req, callback) {
	var publickey = this._z85Encode ? z85.encode(req.credentials[0]) : req.credentials[0];
	
	this._handler({
		domain: req.domain,
		address: req.address,
		publickey: publickey
	}, callback);
}

module.exports = CurveMechanism;
