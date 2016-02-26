'use strict';

/**
 * Supported languages
 */
var LANGUAGES = ['ro', 'ru', 'bg', 'hu', 'it', 'cs', 'pl', 'en'];

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
var END_NAME = '((?:[^\\f\\n\\r\\t\\v,]{3,50})(?:,[^\\f\\n\\r\\t\\v\\.,]{3,30})?)';
/**
 * Space between quote and name
 */
var NAME_SPACE = '[ \\t\\u00A0]+';
/**
 * Optional space between quote and name
 */
var NAME_SPACE_OPTIONAL = '[ \\t\\u00A0]*';
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
	},
	ru: {
		common: ['рассказал(?:а)?', 'сказал(?:а)?', 'заявил(?:а)?', 'отметил(?:а)?', 'добавил(?:а)?', 'рассказал(?:а)?', 'подчеркнул(?:а)?', 'говорит', 'верит', 'считает', 'думает', 'спрашивает', 'напоминает', 'признал(?:а)?', 'ответил(?:а)?', 'заключил(?:а)?', 'заметил(?:а)?', 'написал(?:а)?']
	},
	bg: {
		common: ['категоричен', 'добавя', 'коментира', 'каза', 'казва', 'заяви', 'призна', 'разказва', 'добави', 'е заяви[^\\s\\.]+', 'убеден', 'попита', 'уточни', 'допълни', 'обясни', 'подчерта', 'поясни', 'завърши']
	},
	hu: {
		common: ['jelentette|utalt|magyarázta|mondta|fogalmazott|mesélte|tette hozzá|emelte ki|emlékeztetett|közölte']
	},
	it: {
		common: ['rilancia|hanno raccontato|ha detto|racconta|ha chiarito']
	},
	cs: {
		common: ['dodal[áa]?|poznamenal[áa]?|vyčíslil|uvedl[áa]?|cituje|reaguje|plánuje|přidáv[áa]?|přiblížil[áa]?|myslí|připouští|tvrdí mluvčí|řekl[áa]?|sdělil[áa]?|upozornil[áa]?|snažil[áa]?|vysvětlil(?:á|a)?|doplnil[áa]?|potvrdil[áa]?|říká|dodává|oznámil|komentovala']
	},
	pl: {
		common: ['powiedział|mówił|mówi|podkreślał|podkreśla|dodaje|ocenił|odpowiada|zwrócił|zaznaczył|dodano|podkreślił|radzi']
	},
	en: {
		common: ['said', 'added', 'wrote', 'told']
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
	},
	// Russian data
	ru: {
		quoteMarks: [QUOTE_MARKS[0], QUOTE_MARKS[1], QUOTE_MARKS[2], QUOTE_MARKS[3], QUOTE_MARKS[4]],
		end: [
			',?' + NAME_SPACE + '(?:[—–-]?[ \\t]+)?' + verbs(VERBS.ru.common) + NAME_SPACE + END_NAME
		]
	},
	bg: {
		quoteMarks: [QUOTE_MARKS[1], QUOTE_MARKS[2], QUOTE_MARKS[3], QUOTE_MARKS[4]],
		end: [
			',?' + NAME_SPACE + '(?:[—–-]?[ \\t]+)?' + verbs(VERBS.bg.common) + NAME_SPACE + END_NAME
		]
	},
	hu: {
		end: [
			NAME_SPACE_OPTIONAL + '[-—]' + NAME_SPACE_OPTIONAL + verbs(VERBS.hu.common) + NAME_SPACE + END_NAME
		],
		quoteMarks: [QUOTE_MARKS[0], QUOTE_MARKS[2], QUOTE_MARKS[3], QUOTE_MARKS[7]]
	},
	it: {
		end: [
			',?' + NAME_SPACE + verbs(VERBS.it.common) + NAME_SPACE + END_NAME
		],
		quoteMarks: [QUOTE_MARKS[1], QUOTE_MARKS[3]]
	},
	cs: {
		end: [
			NAME_SPACE + verbs(VERBS.cs.common) + NAME_SPACE + END_NAME
		],
		quoteMarks: [QUOTE_MARKS[3]]
	},
	pl: {
		end: [
			NAME_SPACE + '[—–-]' + NAME_SPACE + verbs(VERBS.pl.common) + NAME_SPACE + END_NAME
		],
		quoteMarks: [QUOTE_MARKS[3]],
		regs: [{
			reg: new RegExp('\\n- ' + QUOTE + NAME_SPACE + '[—–-]' + NAME_SPACE + verbs(VERBS.pl.common) + NAME_SPACE + END_NAME, 'gi'),
			name: 1,
			quote: 0
		}]
	},
	en: {
		quoteMarks: [QUOTE_MARKS[2], QUOTE_MARKS[3]],
		start: [
			// Trump added: "By the way, I released my financial statements..."
			START_NAME + NAME_SPACE + verbs(VERBS.en.common) + ':' + NAME_SPACE
		],
		end: [
			// "It's a hellacious problem," said Hugh Ray
			NAME_SPACE + verbs(VERBS.en.common) + NAME_SPACE + END_NAME,
			// "I'll win states that aren't in play." Trump said.
			NAME_SPACE + START_NAME + NAME_SPACE + verbs(VERBS.en.common),
			// “My parents never really told me I couldn’t do anything.” – Shaun White
			NAME_SPACE_OPTIONAL + '[—–-]' + NAME_SPACE_OPTIONAL + START_NAME
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
		if (data.end) {
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
		}
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

exports.isValidLanguage = function isValidLanguage(lang) {
	return LANGUAGES.indexOf(lang) > -1;
};
