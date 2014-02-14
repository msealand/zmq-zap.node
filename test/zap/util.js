var zmqzap = require('../../');

module.exports.generateRequest = function(returnPath, version, requestId, domain, address, identity, mechanism, credentials) {
	var req = [];
	if (returnPath) req = req.concat(returnPath);
	req.push([]);
	req.push(version ? new Buffer(version, 'utf8') : []);
	req.push(requestId ? new Buffer(requestId, 'utf8') : []);
	req.push(domain ? new Buffer(domain, 'utf8') : []);
	req.push(address ? new Buffer(address, 'utf8') : []);
	req.push(identity ? new Buffer(identity, 'utf8') : []);
	req.push(mechanism ? new Buffer(mechanism, 'utf8') : []);
	if (credentials) {
		if (Array.isArray(credentials)) req = req.concat(credentials);
		else req.push(credentials);
	}
	// console.log(req);
	return req;
}

module.exports.zap = function(message, authenticator, callback) {
	var zap = new zmqzap.ZAP();
	zap.use({
		name: 'TEST',
		authenticate: authenticator
	});
	zap.authenticate(message, callback);
}

module.exports.noCallAuthenticator = function(data, callback) {
	throw new Error("TestMechanism.authenticate() should not be called");
}

module.exports.parseResponse = function(data) {
	var res = {
		returnPath: []
	};
	
	var frame = data.shift();
	if (frame) {
		while (frame && (frame.length != 0)) {
			res.returnPath.push(frame);
			frame = data.shift();
		}
	}
	
	if (data && (data.length >= 6)) {
		res.version = new Buffer(data.shift()).toString('utf8');
		res.requestId = new Buffer(data.shift()).toString('utf8');
		res.statusCode = new Buffer(data.shift()).toString('utf8');
		res.message = new Buffer(data.shift()).toString('utf8');
		res.userId = new Buffer(data.shift()).toString('utf8');
		res.metadata = data.shift();
		res._extra = data.splice(0);
	}
	
	return res;
}
