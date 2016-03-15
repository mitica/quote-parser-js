# quote-parser

A node.js module for extracting quotes from text.

Supported languages: ['ro', 'ru', 'bg', 'hu', 'it', 'cs', 'pl', 'en'].

The project detects 2 parts of a quote:
 1. The quote body - exact;
 2. The author's name - NOT exact.


## Usage

```
var parser = require('quote-parser');
// example 1
var text = '"It\'s a hellacious problem," said Hugh Ray to the...';
var quotes = parser.parse(text, 'en', { minLength: 10 });

console.log(quotes);
// [ { index: 1,
//    text: 'It\'s a hellacious problem,',
//    name: { index: 34, text: 'Hugh Ray to the...' } } ]

// example 2
var text = 'Plus "Nu cred ca este adevarat!", a spus Vlad Filat';
var lang = 'ro';
var quotes = parser.parse(text, lang, {
  persons: [{
    index: 41,
    id: 101
  }]
});

console.log(quotes);
// [ { index: 6,
//    text: 'Nu cred ca este adevarat!',
//    name: { index: 41, text: 'Vlad Filat' },
//    author: { index: 41, id: 101 } } ]
```

## API

### parser.languages();

Return a list of supported languages.

### parser.parse(text, lang[, options]);

Extract quotes from text.

- **text** (String) **required**;
- **lang** (String) - two chars language code, default: `en`;
- **options** (Object):
  - *minLength* (Number) - min quote length, default: 30;
  - *persons* ([Person]) - a list of persons, a person:
    - *index* (Number) **required** - index of the person name in text;

### Result

A list of quotes:

- **text** (String) - quote text;
- **index** (Number) - quote index in the text;
- **name** (Object) - an object where can be the author's name:
  - **text** (String);
  - **index** (Number);
- **author** (Object) - Author if founded.

## Changelog

### 16-03-2016, v0.1.4

- EN: Support new line quote author's name:
```
"Quote body"
- Author Name
```
