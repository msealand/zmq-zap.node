test:
	@./node_modules/.bin/mocha -R spec

test-cov: istanbul
	
istanbul:
	istanbul cover ./node_modules/mocha/bin/_mocha -- -R spec 
	
coveralls:
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

.PHONY: test
