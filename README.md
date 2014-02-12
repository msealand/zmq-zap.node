# zmq-zap

[ZeroMQ Authentication Protocol (ZAP)](http://rfc.zeromq.org/spec:27) for [node.js](http://nodejs.org)

### This is a work in progress!  
**I'm actively working on the API and may need to make breaking changes often.**
Feel free to play with it, make suggestions, pull requests, etc., but keep in mind that it's **not ready for production use**.

## Prerequisites

_Technically this module is not dependant on ØMQ (ZeroMQ) and could be used on it's own if you really wanted to.  That being said, I suspect most, if not all, use cases will involve ØMQ._

- [libsodium](https://github.com/jedisct1/libsodium) _Only required when using the CURVE mechanism_
- [ØMQ 4.x](http://zeromq.org/intro:get-the-software)
- [ØMQ node bindings (zmq)](https://github.com/JustinTulloss/zeromq.node) _You should be able to use any node bindings for ØMQ that support the appropriate socket options, but that's the one I use and recommend._
**NOTE: I submitted [JustinTulloss/zeromq.node#278](https://github.com/JustinTulloss/zeromq.node/pull/278) that enables the required socket options for the ØMQ 4.x security mechanisms. Until that pull request is merged (or something similar is done) [msealand/zeromq.node](https://github.com/msealand/zeromq.node) can be used instead.**
- [z85](https://github.com/msealand/z85.node) _Only required when using the CURVE mechanism. This is used to encode/decode the public/private key pairs._

## Intallation

	$ npm install zmq-zap
	
## Examples

See [examples](examples/).

## Debugging

This may help, but no promises:

	$ DEBUG=zmq-zap:* node ...
