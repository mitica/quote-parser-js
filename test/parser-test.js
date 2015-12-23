/*eslint handle-callback-err:1*/
'use strict';

var parser = require('../lib/index');
var assert = require('assert');

describe('parser', function() {
	it('should whrow error for invalid text/language', function() {
		assert.throws(function() {
			parser.parse();
		});
		assert.throws(function() {
			parser.parse('text', '__');
		});
	});

	it('should filter quotes', function() {
		var text = '"Nu cred ca este adevarat!", a spus Vlad Filat';
		var quotes = parser.parse(text, 'ro', {
			minLength: 100
		});
		assert.equal(0, quotes.length);
	});

	it('should parse simple quote', function() {
		var quotes = parser.parse('"Nu cred ca este adevarat!", a spus Vlad Filat', 'ro', {
			minLength: 15
		});
		assert.equal(1, quotes.length);
		assert.equal('Nu cred ca este adevarat!', quotes[0].text);
		assert.equal(1, quotes[0].index);
		assert.equal('Vlad Filat', quotes[0].name.text);
	});

	it('should find quote & author', function() {
		var text = 'Plus "Nu cred ca este adevarat!", a spus Vlad Filat';
		var quotes = parser.parse(text, 'ro', {
			minLength: 15,
			persons: [{
				index: 41,
				id: 101
			}]
		});
		assert.equal(1, quotes.length);
		var quote = quotes[0];
		assert.equal('Nu cred ca este adevarat!', quote.text);
		assert.equal(6, quote.index);
		assert.equal('Vlad Filat', quote.name.text);
		assert.equal(101, quote.author.id);
	});
});
