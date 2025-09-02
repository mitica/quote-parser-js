'use strict';

var config = require('../dist/cjs/config');
var assert = require('assert');

describe('config', function() {
	it('should get LANGUAGES', function() {
		var languages = config.languages();
		assert.ok(languages);
		assert.equal(9, languages.length);
	});

	it('should get RULES', function() {
		config.languages().forEach(function(lang) {
			var rules = config.rules(lang);
			// if (lang === 'en') {
			// 	console.log(rules);
			// }
			assert.ok(rules);
			assert.ok(rules.length);
		});
	});
});
