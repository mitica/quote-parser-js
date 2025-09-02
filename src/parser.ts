import { rules } from "./config";
import { isValidQuote, findQuoteAuthor, formatOptions } from "./helpers";
import { Rule, Quote, ParseOptions } from "./common";

export function findQuotes(
  rule: Rule,
  text: string,
  lang: string,
  options: ParseOptions
): Quote[] {
  const quotes: Quote[] = [];
  let result: RegExpExecArray | null;
  while ((result = rule.reg.exec(text)) !== null) {
    const qText = result[rule.quote + 1];
    const qIndex = result[0].indexOf(qText) + result.index;
    const nText = result[rule.name + 1];
    const nIndex = result[0].indexOf(nText) + result.index;
    const q: Quote = {
      index: qIndex,
      text: qText,
      name: {
        index: nIndex,
        text: nText,
      },
    };
    if (isValidQuote(q, options)) {
      findQuoteAuthor(text, lang, q, options);
      quotes.push(q);
    }
  }
  return quotes;
}

export function parse(
  text: string,
  lang: string = "en",
  options?: ParseOptions
): Quote[] {
  options = formatOptions(options);
  const rulesArr = rules(lang);
  let quotes: Quote[] = [];
  rulesArr.forEach((rule) => {
    quotes = quotes.concat(findQuotes(rule, text, lang, options));
  });
  if (options.extraRules && options.extraRules.length > 0) {
    options.extraRules.forEach((rule) => {
      if (
        rule.reg &&
        typeof rule.quote === "number" &&
        typeof rule.name === "number"
      ) {
        quotes = quotes.concat(findQuotes(rule, text, lang, options));
      }
    });
  }
  // sort by index & name.index
  return quotes
    .sort((a, b) => {
      if (a.index === b.index) {
        return a.name.index - b.name.index;
      }
      return a.index - b.index;
    })
    .filter(
      (quote, index, self) =>
        index === self.findIndex((q) => q.index === quote.index)
    );
}
