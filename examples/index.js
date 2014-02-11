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
	var zmqzap = require('../'),
		ZAP = zmqzap.ZAP,
		NullMechanism = zmqzap.NullMechanism,
		PlainMechanism = zmqzap.PlainMechanism,
		CurveMechanism = zmqzap.CurveMechanism;
	
	var zap = new ZAP();
	
	// Setup mechanism(s) (only one of these is needed in most cases)
	zap.use(new NullMechanism(function(data, callback) {
		if (data.domain != 'test') callback(null, false);
		else callback(null, true);
	}));
	zap.use(new PlainMechanism(function(data, callback) {
		if (data.domain != 'test') callback(null, false);
		else if (data.username != 'user') callback(null, false);
		else if (data.password != 'pass') callback(null, false);
		else callback(null, true);
	}));
	zap.use(new CurveMechanism(function(data, callback) {
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