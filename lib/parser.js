'use strict';

var config = require('./config');
var helpers = require('./helpers');

function parse(text, lang, options) {
	var regexes = config.regs(lang);
	var result;
	var quotes = [];
	regexes.forEach(function(regex) {
		while ((result = regex.reg.exec(text)) !== null) {
			var qText = result[regex.quote + 1];
			var qIndex = result[0].indexOf(qText) + result.index;
			var nText = result[regex.name + 1];
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
	});

	return quotes;
}

exports.parse = parse;
