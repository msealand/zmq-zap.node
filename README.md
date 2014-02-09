# NOTE: Work in progress!  

Feel free to play with it, make suggestions, pull requests, etc., but keep in mind that it's **not ready for production use**.

# zmq-zap

[ZeroMQ Authentication Protocol](http://rfc.zeromq.org/spec:27) for node.js

## Intallation

	$ npm install zmq-zap
	
## Example

This is just some code I've been using for testing; it's mostly just a copy of [this](https://github.com/JustinTulloss/zeromq.node/blob/master/examples/rep_req.js) with the ZAP stuff added.

**TODO: Create a better example and actually explain what's going on**

This example will need:

	$ npm install zmq z85 zmq-zap
	
**NOTE: I submitted a [pull request](https://github.com/JustinTulloss/zeromq.node/pull/278) that enables the required socket options for the ZeroMQ 4.x security mechanisms. Until that pull request is merged (or something similar is done) [this repo](https://github.com/msealand/zeromq.node) can be used to get all this working. Also, you must have [libzmq 4.x](http://zeromq.org/intro:get-the-software) installed for any of this to work.**

The code below is setup to use the [NULL](http://rfc.zeromq.org/spec:27#toc13) mechanism.  If you want to use the [PLAIN](http://rfc.zeromq.org/spec:27#toc14) or [CURVE](http://rfc.zeromq.org/spec:27#toc15) mechanisms, uncomment the appropriate lines to set the socket options on both client and server sockets.

public/private key pairs for the CURVE mechanism were generated with:

	$ curve_keygen
	
which should be included in the libzmq 4.x install

```js
var z85 = require('z85');

var serverPublicKey = z85.decode('E&ahzm6FilM:*[[7G1Df!cd$}(Z8}=K!>#QwNrnn');

var cluster = require('cluster'),
	zeromq = require('zmq'),
	port = 'tcp://127.0.0.1:12345';

if (cluster.isMaster) {
    // Fork a couple of client...
    for (var i = 0; i < 2; i++) {
        cluster.fork();
    }
	
// ----- ZAP -----
	var zmqzap = require('zmq-zap'),
		ZAP = zmqzap.ZAP,
		NullMechanism = zmqzap.NullMechanism,
		PlainMechanism = zmqzap.PlainMechanism,
		CurveMechanism = zmqzap.CurveMechanism;
	
	var zap = new ZAP();
	
	// Setup mechanism(s) (only one of these is needed in most cases)
	zap.use('NULL', new NullMechanism(function(data, callback) {
		if (data.domain != 'test') callback(null, false);
		else callback(null, true);
	}));
	zap.use('PLAIN', new PlainMechanism(function(data, callback) {
		if (data.domain != 'test') callback(null, false);
		else if (data.username != 'user') callback(null, false);
		else if (data.password != 'pass') callback(null, false);
		else callback(null, true);
	}));
	zap.use('CURVE', new CurveMechanism(function(data, callback) {
		if (data.domain != 'test') callback(null, false);
		else if (data.publickey != '(kW)UE2vR%M^!mp9LPJ]3%[o?Y-344U?#LKW8m>(') callback(null, false);
		else callback(null, true);
	}));
	
	// Setup ZeroMQ ZAP socket
	var zapSocket = zeromq.socket('router');
	zapSocket.on('message', function() {
		zap.authenticate(arguments, function(err, response) {
			if (err) console.error('Error:', err);
			if (response) zapSocket.send(response);
		});
	});
	zapSocket.bindSync('inproc://zeromq.zap.01');
// --- END ZAP ---

	var serverSecret = CurveMechanism.z85Decode('a6*<Em>Zd^a4ENdsGp>MNZ8-PevbUblDfk(9NJA<')

    var socket = zeromq.socket('rep');
    socket.identity = 'server' + process.pid;
	
	// Minimum needed for NULL mechanism
	// Comment out to disable ZAP
	socket.zap_domain = "test";
	
	// Uncomment for PLAIN mechanism
	// socket.plain_server = 1;
	
	// Uncomment for CURVE mechanism
	// socket.curve_server = 1;
	// socket.curve_secretkey = serverSecret;


    socket.bind(port, function(err) {
        if (err) throw err;
        console.log('bound!');

	    socket.on('message', function(data) {
	        console.log(socket.identity + ': received ' + data.toString());
	        socket.send(data * 2);
	    });
    });
} else {
	var clientPublicKey = z85.decode('(kW)UE2vR%M^!mp9LPJ]3%[o?Y-344U?#LKW8m>('),
		clientSecret = z85.decode('Gzy#j=-mi{2iCF2vi]N?pketY7+cI*xc8YXRFjH1');
		
    var socket = zeromq.socket('req');
    socket.identity = 'client' + process.pid;
	
	// Uncomment for PLAIN mechanism
	// socket.plain_username = "user";
	// socket.plain_password = "pass";
	
	// Uncomment for CURVE mechanism
	// socket.curve_serverkey = serverPublicKey;
	// socket.curve_publickey = clientPublicKey;
	// socket.curve_secretkey = clientSecret;

	socket.connect(port);	
    console.log('connected!');
	
    setInterval(function() {
        var value = Math.floor(Math.random()*100);
    
        console.log(socket.identity + ': asking ' + value);
        socket.send(value);
    }, 1000);

    socket.on('message', function(data) {
        console.log(socket.identity + ': answer data ' + data);
    });
}
```

## Debugging

This may help, but no promises:

	$ DEBUG=zmq-zap:* node ...

## Tests

**TODO: Write some**
