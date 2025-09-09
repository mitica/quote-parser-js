import { ParseOptions, Person, Quote } from "./common";

const OPTIONS = {
  minLength: 30,
};

const INVALID_AUTHOR_PREFIXES: Record<string, RegExp[]> = {
  ro: [
    /\b(lui|despre|pe|[sș]i|la|cu|c[ăa])$/i,
    /\b(liceul[^\s\.;,:-]*)$/i,
    /ului$/i,
    /\b(anturajul|fanele|pentru|al|c[ăa]tre)$/i,
    /["“”„«]$/i,
  ],
};

const QUOTE_START_REG = /^[^\.,;:\/!?+=_(){}\[\] -]/i;

export function formatOptions(options?: ParseOptions): ParseOptions {
  if (!options) {
    return OPTIONS;
  }
  options = { ...OPTIONS, ...options };
  return options;
}

export function isValidQuote(quote: Quote, options: ParseOptions) {
  return (
    quote &&
    quote.text &&
    quote.text.trim().length >= (options.minLength || OPTIONS.minLength) &&
    QUOTE_START_REG.test(quote.text)
  );
}

function isAuthor(text: string, lang: string, quote: Quote, person: Person) {
  if (
    person.index >= quote.name.index &&
    person.index < quote.name.index + quote.name.text.length
  ) {
    const regPrefixes = INVALID_AUTHOR_PREFIXES[lang];
    if (regPrefixes) {
      const prefix = text.substring(quote.name.index, person.index).trim();
      // console.log("Author prefix:", `"${prefix}"`);
      for (let i = regPrefixes.length - 1; i >= 0; i--) {
        const regp = regPrefixes[i];
        if (regp.test(prefix)) {
          // console.log("Invalid author prefix:", regp, `"${prefix}"`);
          return false;
        }
      }
    }
    return true;
  }
  return false;
}

export function findQuoteAuthor(
  text: string,
  lang: string,
  quote: Quote,
  options: ParseOptions
) {
  const persons = options.persons;
  if (!persons || !persons.length) {
    return null;
  }
  for (let i = 0; i < persons.length; i++) {
    const person = persons[i];
    if (isAuthor(text, lang, quote, person)) {
      quote.author = person;
      break;
    }
  }
}
