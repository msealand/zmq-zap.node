var zmq = require('zmq'),
	debug = require('debug')('zmq-zap:examples:plain'),
	port = 'tcp://127.0.0.1:12345';


// Requires for ZAP handler
var zmqzap = require('../'),
	ZAP = zmqzap.ZAP,
	PlainMechanism = zmqzap.PlainMechanism;

// Create a new ZAP Handler
var zap = new ZAP();

// Tell it to use the PLAIN mechanism for authentication
zap.use(new PlainMechanism(function(data, callback) {
	debug('Authenticating %s', JSON.stringify(data, true, 2));

	// This is where you'd check to see if you want to let the socket connect.
	// The PLAIN mechanism lets you authenticate based on domain and address as well as username and password.

	// For this example, let sockets connect where the "server" is in the "test" domain and the "client"'s address is "127.0.0.1"
	if ((data.domain == 'test') && (data.address == "127.0.0.1")) {
		// and where the username is "user" and the password is "pass"
		if ((data.username == "user") && (data.password == "pass"))	callback(null, true);
		else callback(null, false);
	}
	else callback(null, false);
}));

// Setup ZeroMQ ZAP socket
// We'll use a router so that we can handle multiple requests at once
var zapSocket = zmq.socket('router');
zapSocket.on('message', function() {
	// When we get a message, send it through to the ZAP handler
	zap.authenticate(arguments, function(err, response) {
		if (err) console.error('Error:', err);
		
		// Always send the response if the handler gives us one in the callback.
		// This should be done even if there is an error so that we don't block any sockets.
		if (response) zapSocket.send(response);
	});
});

// The socket for the ZAP handler should be bound before creating any sockets that will use it.
// We'll use bindSync to make sure that the bind completes before we do anything else.
zapSocket.bindSync('inproc://zeromq.zap.01');



// Setup a rep "server"
// Although ZMQ doesn't typically think of sockets as "server" or "client", the security mechanisms are different in that there should always be a "server" side that handles the authentication piece.
var rep = zmq.socket('rep');
rep.identity = "rep-socket";

// Tell the socket that we want it to be a PLAIN "server"
rep.plain_server = 1;
// We'll also set a domain, but this is optional for the PLAIN mechanism
rep.zap_domain = "test";

// This is just typical rep bind stuff. 
// It'll look for a "hello" message and send back "world"
rep.bind(port, function(err) {
    if (err) throw err;
	debug('rep bound');
    rep.on('message', function(data) {
		debug('rep received %s', data);
	    if (data == 'hello') rep.send('world');
		else {
			debug('unknown message: %s', data);
			req.send('huh?');
		}
    });
});


// Setup a req "client"
// This will send a "hello" message once it connect and expect "world" back
// The example will exit after this receives a message
var req = zmq.socket('req');
req.identity = "req-socket";

// Set the PLAIN "client" username and password for this socket
req.plain_username = "user";
req.plain_password = "pass";

req.connect(port);
debug('req connected');
req.send('hello');
debug('req hello sent');

req.on('message', function(data) {
	debug('req received %s', data);
    if (data == 'world') debug('success!');
	else debug('unknown message: %s', data);
	
	process.exit();
});
