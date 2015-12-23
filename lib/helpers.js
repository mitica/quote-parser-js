'use strict';

var OPTIONS = {
	// A list of persons
	// persons: [{index:10}],
	minLength: 30
};

var INVALID_AUTHOR_PREFIXES = {
	ro: [
		/\b(lui|despre|pe|[sș]i|la|cu|c[ăa])$/i,
		/\b(liceul[^\s\.;,:-]*)$/i,
		/ului$/i,
		/\b(anturajul|fanele|pentru|al|c[ăa]tre)$/i,
		/["“”„«]$/i
	]
};

var QUOTE_START_REG = /^[^\.,;:\/!?+=_(){}\[\] -]/i;

function formatOptions(options) {
	if (!options) {
		return OPTIONS;
	}
	for (var prop in OPTIONS) {
		if (typeof options[prop] === 'undefined') {
			options[prop] = OPTIONS[prop];
		}
	}

	return options;
}

function isValidQuote(quote, options) {
	return quote && quote.text && quote.text.trim().length >= options.minLength && QUOTE_START_REG.test(quote.text);
}

function isAuthor(text, lang, quote, person) {
	if (person.index >= quote.name.index && person.index < quote.name.index + quote.name.text.length) {
		var regPrefixes = INVALID_AUTHOR_PREFIXES[lang];
		if (regPrefixes) {
			var prefix = text.substr(0, person.index).trim();
			//console.log('prefix', prefix);
			for (var i = regPrefixes.length - 1; i >= 0; i--) {
				var regp = regPrefixes[i];
				if (regp.test(prefix)) {
					return false;
				}
			}
		}
		return true;
	}
	return false;
}

function findQuoteAuthor(text, lang, quote, options) {
	var persons = options.persons;
	if (!persons || !persons.length) {
		return null;
	}
	for (var i = 0; i < persons.length; i++) {
		var person = persons[i];
		if (isAuthor(text, lang, quote, person)) {
			quote.author = person;
			break;
		}
	}
}

exports.isValidQuote = isValidQuote;
exports.formatOptions = formatOptions;
exports.findQuoteAuthor = findQuoteAuthor;
