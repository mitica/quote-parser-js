'use strict';

var config = require('./config');
var parser = require('./parser');
var helpers = require('./helpers');

function parse(text, lang, options) {
	if (!text) {
		throw new Error('Invalid argument "text"');
	}
	if (!lang || typeof lang !== 'string') {
		throw new Error('Invalid argument "lang"');
	}
	if (!config.isValidLanguage(lang)) {
		throw new Error('Lang "' + lang + '" is not supported');
	}

	options = helpers.formatOptions(options);

	return parser.parse(text, lang, options);
}

exports.parse = parse;
exports.languages = config.languages;
