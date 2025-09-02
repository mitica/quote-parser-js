import { languages, isValidLanguage } from "./config";
import { parse as parseQuotes, ParseOptions, Quote } from "./parser";
import { formatOptions } from "./helpers";

export function parse(text: string, lang: string, options?: ParseOptions) {
  if (!text) {
    throw new Error('Invalid argument "text"');
  }
  if (!lang || typeof lang !== "string") {
    throw new Error('Invalid argument "lang"');
  }
  if (!isValidLanguage(lang)) {
    throw new Error('Lang "' + lang + '" is not supported');
  }
  options = formatOptions(options);
  return parseQuotes(text, lang, options);
}

export { languages, type ParseOptions, type Quote };
