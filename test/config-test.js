/*eslint handle-callback-err:1*/
'use strict';

var config = require('../lib/config');
var assert = require('assert');

describe('config', function() {
	it('should get LANGUAGES', function() {
		var languages = config.languages();
		assert.ok(languages);
		assert.equal(1, languages.length);
	});

	it('should get REGS', function() {
		var regs = config.regs('ro');
		assert.ok(regs);
		assert.ok(regs.length);
	});
});
