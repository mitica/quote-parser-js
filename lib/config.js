'use strict';

/**
 * Supported languages
 */
var LANGUAGES = ['ro'];//, 'ru', 'bg', 'hu', 'it', 'cs', 'pl'];

/**
 * Quote marks formats
 */
var QUOTE_MARKS = [
	// 0
	['„', '”', '“'],
	// 1
	['«', '»'],
	// 2
	['“', '”', '„'],
	// 3
	['"', '"', '„', '“', '”'],
	// 4
	['„', '“', '”'],
	// 5
	['’', '’', '„', '“', '”'],
	// 6
	['‘', '’', '„', '“', '”'],
	// 7
	['»', '«', '„', '”', '“'],
	// 8
	['”', '”', '„', '“'],
	// 9
	['„', '"', '”']
];

/**
 * Quote regex
 */
var QUOTE = '([^\\f\\t\\v]{10,})';
/**
 * Regex for start name
 */
var START_NAME = '([^\\f\\n\\r\\t\\v,]{3,30})';
/**
 * Regex for end name
 */
var END_NAME = '((?:[^\\f\\n\\r\\t\\v,]{3,50}),?(?:[^\\f\\n\\r\\t\\v\\.,]{3,30})?)';
/**
 * Space between quote and name
 */
var NAME_SPACE = '[ \\t]+';
/**
 * Optional space between quote and name
 */
var NAME_SPACE_OPTIONAL = '[ \\t]*';
/**
 * Verbs
 */
var VERBS = {
	ro: {
		first: [
			'anun[țt]at', 'avertizat', 'afirmat', 'acuzat', 'ad[aă]ugat', 'amintit', 'amenin[tț]at',
			'conchis',
			'declarat',
			'[îi]ntrebat',
			'glumit',
			'men[tț]ionat',
			'precizat',
			'recunoscut', 'replicat', 'r[ăa]spuns', 'ripostat',
			'spus', 'specificat', 'subliniat', 'scris',
			'zis'
		],
		second: [
			'aminte[sș]te', 'amenin[tț][aă]', 'avertizeaz[aă]', 'adaug[aă]', 'anun[tț][aă]', 'afirm[aă]', 'acuz[aă]',
			'crede', 'conchide',
			'declar[ăa]',
			'[îi]ntreab[aă]',
			'glume[sș]te',
			'men[tț]ioneaz[ăa]',
			'precizeaz[aă]',
			'recunoa[sș]te',
			'r[ăa]spunde', 'riposteaz[ăa]',
			'spera', 'sus[tț]ine', 'sugereaz[aă]', 'specific[aă]', 'subliniaz[aă]', 'spune', 'scrie',
			'zice'
		],
		third: [
			'anun[țt]e', 'avertizeze', 'adauge', 'aminteasc[aă]', 'amenin[tț]e', 'afirme', 'acuze', 'aminteasc[ăa]',
			'conchid[aă]',
			'declarare',
			'[îi]ntrebe',
			'glumeasc[ăa]',
			'men[tț]ioneze',
			'precizeze',
			'recunoasc[aă]', 'r[ăa]spund[ăa]', 'riposteze',
			'spun[aă]', 'specifice', 'sublinieze',
			'zic[aă]'
		],
		us: [
			'[îi]ntreab[ăa]',
			'teme'
		]
	}
};

function verbs(list) {
	return '(?:' + list.join('|') + ')';
}

/**
 * Config data
 */
var DATA = {
	// Romanian data
	ro: {
		quoteMarks: [QUOTE_MARKS[0], QUOTE_MARKS[1], QUOTE_MARKS[2], QUOTE_MARKS[3], QUOTE_MARKS[4], QUOTE_MARKS[8]],
		start: [
			START_NAME + ':' + NAME_SPACE,
			START_NAME + ',?' + NAME_SPACE + '(?:a|i-a)(?: mai)?' + NAME_SPACE + verbs(VERBS.ro.first) + '(?: c[ăa])?:' + NAME_SPACE,
			START_NAME + ',?(?: mai)?' + NAME_SPACE + verbs(VERBS.ro.second) + '(?: c[ăa])?:' + NAME_SPACE
		],
		end: [
			',?' + NAME_SPACE + verbs(VERBS.ro.second) + NAME_SPACE + END_NAME,
			',?' + NAME_SPACE + '(?:a|i-a)(?: mai)?' + NAME_SPACE + verbs(VERBS.ro.first) + NAME_SPACE + END_NAME,
			',?' + NAME_SPACE + 'a(?: mai)? (?:[țt]inut|dorit) s[aă] ' + verbs(VERBS.ro.third) + NAME_SPACE + END_NAME,
			',?' + NAME_SPACE + '(?:se|ne)(?: mai)?' + NAME_SPACE + verbs(VERBS.ro.us) + NAME_SPACE + END_NAME
		]
	}
};

/**
 * Regular expressions
 */
var REGS = {};

function getInvalidQuoteMarks(quoteMarks) {
	return quoteMarks.join('');
}

function init() {
	var data;
	var pattern;
	LANGUAGES.forEach(function(lang) {
		REGS[lang] = DATA[lang].regs || [];
		data = DATA[lang];
		data.end.forEach(function(word) {
			data.quoteMarks.forEach(function(qChar) {
				pattern = qChar[0] + QUOTE.replace(/]/, getInvalidQuoteMarks(qChar) + ']') + (qChar.length > 1 ? qChar[1] : '') + word;
				REGS[lang].push({
					reg: new RegExp(pattern, 'gi'),
					name: 1,
					quote: 0
				});
			});
		});
		if (data.start) {
			data.start.forEach(function(word) {
				data.quoteMarks.forEach(function(qChar) {
					pattern = word + qChar[0] + QUOTE.replace(/]/, getInvalidQuoteMarks(qChar) + ']') + qChar[1];
					REGS[lang].push({
						reg: new RegExp(pattern, 'gi'),
						name: 0,
						quote: 1
					});
				});
			});
		}
	});
}

init();

exports.regs = function regs(lang) {
	return REGS[lang];
};

exports.languages = function languages() {
	return LANGUAGES;
};
