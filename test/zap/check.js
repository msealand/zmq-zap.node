var should = require('should'),
	util = require('./util');

var error = module.exports.error = {
	none: function(err) {
		should.not.exist(err);
	},
	general: function(err) {
		should.exist(err);
		err.should.be.an.Error;
	},
	invalidMessage: function(err) {
		should.exist(err);
		err.should.be.an.Error;
		err.message.should.eql('Invalid Message');
	},
	noAuthenticator: function(err) {
		should.exist(err);
		err.should.be.an.Error;
		err.message.should.eql('No Authenticator');
	}
}

var response = module.exports.response = {
	none: function(req, res) {
		should.not.exist(res);
	},
	valid: function(req, res) {
		should.exist(res);
		res.should.be.an.Array;
		res.length.should.be.greaterThan(6, "response length should be > 6");
		
		var pres = util.parseResponse(res);
		should.exist(pres);
		pres.version.should.eql(req.version);
		pres.requestId.should.eql(req.requestId);
		pres._extra.should.have.length(0);
		
		return pres;
	},
	success: function(req, res, userId) {
		res = response.valid(req, res);
		res.statusCode.should.eql(200);
		if (userId) res.userId.should.eql(userId);
		else res.userId.should.have.length(0);
		res.metadata.should.have.length(0);
	},
	failure: function(req, res) {
		res = response.valid(req, res);
		res.statusCode.should.eql(400);
		res.userId.should.have.length(0);
		res.metadata.should.have.length(0);
	},
	generalError: function(req, res) {
		res = response.valid(req, res);
		res.statusCode.should.eql(500);
		res.userId.should.have.length(0);
		res.metadata.should.have.length(0);
	},
	invalidMessage: function(req, res) {
		res = response.valid(req, res);
		res.statusCode.should.eql(300);
		res.message.should.eql("INVALID MESSAGE");
		res.userId.should.have.length(0);
		res.metadata.should.have.length(0);
	},
	noAuthenticator: function(req, res) {
		res = response.valid(req, res);
		res.statusCode.should.eql(500);
		res.message.should.eql("NO AUTHENTICATOR");
		res.userId.should.have.length(0);
		res.metadata.should.have.length(0);
	}
}
