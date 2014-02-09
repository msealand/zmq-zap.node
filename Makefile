TESTS=$(shell find test -name *.test.js)

test:
	@./node_modules/.bin/mocha --ui exports --recursive $(TESTS)

.PHONY: test