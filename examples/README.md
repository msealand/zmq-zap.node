# Examples

## NULL Mechanism

[null.js](null.js)

A very basic example of using the NULL authentication mechanism with the req-rep pattern.  Until there's a better write up, see the comments in the code.

This example will need zmq installed:

	$ npm install zmq
	
**NOTE: I submitted a [pull request](https://github.com/JustinTulloss/zeromq.node/pull/278) that enables the required socket options for the ZeroMQ 4.x security mechanisms. Until that pull request is merged (or something similar is done) [this repo](https://github.com/msealand/zeromq.node) can be used to get all this working. Also, you must have [libzmq 4.x](http://zeromq.org/intro:get-the-software) and [libsodium](https://github.com/jedisct1/libsodium) installed for any of this to work.**

Running the example with debug output on might give a better idea of what's happening:

	$ DEBUG=zmq-zap:* node examples/null.js
	
It should output something like:

	zmq-zap:examples:null req connected +0ms
	zmq-zap:examples:null req hello sent +3ms
	zmq-zap:examples:null rep bound +1ms
	zmq-zap:zap Authentication request: {
	"version": "1.0",
	"requestId": "1",
	"domain": "test",
	"address": "127.0.0.1",
	"identity": "rep-socket",
	"mechanism": "NULL",
	"credentials": []
	} +0ms
	zmq-zap:examples:null Authenticating {
	"domain": "test",
	"address": "127.0.0.1"
	} +1ms
	zmq-zap:zap Authentication response: {
	"version": "1.0",
	"requestId": "1",
	"statusCode": 200,
	"message": "OK"
	} +0ms
	zmq-zap:examples:null rep received hello +1ms
	zmq-zap:examples:null req received world +0ms
	zmq-zap:examples:null success! +0ms
	