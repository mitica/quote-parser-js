'use strict';

var config = require('./config');
var helpers = require('./helpers');

function findQuotes(rule, text, lang, options) {
	var quotes = [];
	var result;
	while ((result = rule.reg.exec(text)) !== null) {
		var qText = result[rule.quote + 1];
		var qIndex = result[0].indexOf(qText) + result.index;
		var nText = result[rule.name + 1];
		var nIndex = result[0].indexOf(nText) + result.index;
		var q = {
			index: qIndex,
			text: qText,
			name: {
				index: nIndex,
				text: nText
			}
		};

		if (helpers.isValidQuote(q, options)) {
			helpers.findQuoteAuthor(text, lang, q, options);
			quotes.push(q);
		}
	}

	return quotes;
}

function parse(text, lang, options) {
	options = options || {};
	var rules = config.rules(lang);
	var quotes = [];

	rules.forEach(function(rule) {
		quotes = quotes.concat(findQuotes(rule, text, lang, options));
	});

	if (options.extraRules && options.extraRules.length > 0) {
		options.extraRules.forEach(function(rule) {
			if (rule.reg && typeof rule.quote === 'number' && typeof rule.name === 'number') {
				quotes = quotes.concat(findQuotes(rule, text, lang, options));
			}
		});
	}

	return quotes;
}

exports.parse = parse;
