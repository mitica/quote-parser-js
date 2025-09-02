import { rules } from "./config";
import { isValidQuote, findQuoteAuthor } from "./helpers";

export interface Quote {
  index: number;
  text: string;
  name: {
    index: number;
    text: string;
  };
  author?: any;
}

export interface ParseOptions {
  minLength?: number;
  persons?: Array<{ index: number; id: number | string }>;
  extraRules?: Array<{
    reg: RegExp;
    quote: number;
    name: number;
  }>;
}

export function findQuotes(
  rule: any,
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
  options = options || {};
  const rulesArr = rules(lang);
  let quotes: Quote[] = [];
  rulesArr.forEach((rule: any) => {
    quotes = quotes.concat(findQuotes(rule, text, lang, options));
  });
  if (options.extraRules && options.extraRules.length > 0) {
    options.extraRules.forEach((rule: any) => {
      if (
        rule.reg &&
        typeof rule.quote === "number" &&
        typeof rule.name === "number"
      ) {
        quotes = quotes.concat(findQuotes(rule, text, lang, options));
      }
    });
  }
  return quotes;
}
