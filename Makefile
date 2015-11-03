.PHONY: test publish

test:
	meteor test-packages --velocity --driver-package respondly:test-reporter@1.0.1 ./

publish:
	meteor publish

