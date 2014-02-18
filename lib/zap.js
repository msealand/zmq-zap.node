var debug = require('debug')('zmq-zap:zap'),
	net = require('net');

var ZAP = function(options) {
	this._options = options || {};
	this._mechanisms = {};
}

ZAP.prototype._captureReturnPath = function(data) {
	var returnPath = [];
	
	var frame = data.shift();
	if (frame) {
		while (frame && (frame.length != 0)) {
			returnPath.push(frame);
			frame = data.shift();
		}
		returnPath.push(frame);
	}
	
	return returnPath;
}

ZAP.prototype._parseRequestData = function(data) {
	var req;
	if (data && (data.length >= 6)) {
		req = {
			version: new Buffer(data.shift()).toString('utf8'),
			requestId: new Buffer(data.shift()).toString('utf8'),
			domain: new Buffer(data.shift()).toString('utf8'),
			address: new Buffer(data.shift()).toString('utf8'),
			identity: new Buffer(data.shift()).toString('utf8'),
			mechanism: new Buffer(data.shift()).toString('utf8'),
			credentials: data.slice(0)
		};
	}
	return req;
}

ZAP.prototype._validateRequest = function(req, mech) {
	if (req.version != "1.0") return false;
	if (!req.requestId) return false;
	if (!net.isIP(req.address)) return false;
	if (!req.mechanism) return false;
	
	if (mech && (typeof mech.validate === 'function')) return mech.validate(req);
	else return true;
}

ZAP.prototype._generateResponse = function(req, returnPath, statusCode, message, userId/*, metadata*/) {
	if (req && req.version && req.requestId && returnPath && statusCode) {
		/* istanbul ignore next */
		debug('Authentication response: %s', req ? JSON.stringify({
			version: req.version,
			requestId: req.requestId,
			statusCode: statusCode,
			message: message,
			userId: userId,
			// metadata: metadata
		}, true, 2) : 'undefined');

		return returnPath.splice(0).concat([
			new Buffer(req.version, 'utf8'),
			new Buffer(req.requestId, 'utf8'),
			new Buffer(statusCode.toString(), 'utf8'),
			(message ? new Buffer(message, 'utf8') : new Buffer(0)),
			(((statusCode == 200) && userId) ? new Buffer(userId, 'utf8') : new Buffer(0)),
			new Buffer(0) //(((statusCode == 200) && (metadata)) ? metadata : new Buffer(0))
		]);
	} else {
		return;
	}
}

ZAP.prototype.use = function(mechanism) {
	if (!mechanism) throw new Error('Invalid mechanism');
	if ((typeof mechanism.name !== 'string') || !mechanism.name.length) throw new Error("Invalid mechanism name");
	if (typeof mechanism.authenticate !== 'function') throw new Error('Invalid mechanism authenticate handler');
	
	this._mechanisms[mechanism.name] = mechanism;
}

ZAP.prototype.authenticate = function(data, callback) {
	if (!data) {
		callback(new Error("Invalid Message"));
		return;
	}
	
	var data = Array.prototype.slice.call(data); // This forces data to be an array (for when 'arguments' is passed in directly)
	
	var returnPath = this._captureReturnPath(data),
		req = this._parseRequestData(data),
		mech;
		
	if (req) mech = this._mechanisms[req.mechanism];
	
	if (req && this._validateRequest(req, mech)) {
		/* istanbul ignore next */
		debug('Authentication request: %s', JSON.stringify(req, true, 2));
		
		if (mech) {
			mech.authenticate(req, function(err, user, message, metadata) {
				var statusCode, userId, meta;
					
				if (err) {
					statusCode = 500;
					if (!message) message = err.message;
				} else if (user) {
					statusCode = 200;
					if (user !== true) {
						userId = (typeof user !== 'string') ? user.toString() : user;
					}
					meta = metadata;
				} else {
					statusCode = 400;
				}
				
				var res = this._generateResponse(req, returnPath, statusCode, message, userId, meta);
				callback(err, res, req);
			}.bind(this));
		} else {
			var res = this._generateResponse(req, returnPath, 500, "NO AUTHENTICATOR");
			callback(new Error("No Authenticator"), res, req);
		}
	} else {
		var res = this._generateResponse(req, returnPath, 300, "INVALID MESSAGE");
		callback(new Error("Invalid Message"), res, req);
	}
}

module.exports = ZAP;
