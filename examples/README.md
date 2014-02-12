# Examples

These examples use ØMQ directly and will need the [prerequisites](../README.md#prerequisites) installed.

Running the examples with debug output on might give a better idea of what's happening:

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


## NULL Mechanism

A basic example of using the NULL authentication mechanism to authenticate a socket using a domain and address with the req-rep pattern.

[null.js](null.js)
	
## PLAIN Mechanism

A basic example of using the PLAIN authentication mechanism to authenticate a socket using a domain, address, username, and password with the req-rep pattern.

[plain.js](plain.js)

## CURVE Mechanism

A basic example of using the CURVE authentication mechanism to authenticate a socket using a domain, address, and public key and encrypt the data using [elliptic curve encryption](http://en.wikipedia.org/wiki/Elliptic_curve_cryptography) with the req-rep pattern.

[curve.js](curve.js)
