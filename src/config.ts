import { Rule } from "./common";

export const LANGUAGES = [
  "ro",
  "ru",
  "bg",
  "hu",
  "it",
  "cs",
  "pl",
  "en",
  "es",
] as const;
export type Language = (typeof LANGUAGES)[number];

const QUOTE_MARKS = [
  ["„", "”", "“"],
  ["«", "»"],
  ["“", "”", "„"],
  ['"', '"', "„", "“", "”"],
  ["„", "“", "”"],
  ["’", "’", "„", "“", "”"],
  ["‘", "’", "„", "“", "”"],
  ["»", "«", "„", "”", "“"],
  ["”", "”", "„", "“"],
  ["„", '"', "”"],
];

// unique
const ALL_QUOTE_MARKS = QUOTE_MARKS.flat();

const QUOTE = "([^\\f\\t\\v]{10,})";
const START_NAME = `([^\\f\\n\\r\\t\\v!;?]{3,30})`;
const LONG_START_NAME = `([^\\f\\n\\r\\t\\v.!;?]{3,60})`;
const END_NAME =
  "((?:[^\\f\\n\\r\\t\\v,]{3,50})(?:,[^\\f\\n\\r\\t\\v\\.,]{3,30})?)";
const NAME_SPACE = "[ \\t\\u00A0]+";
const NAME_SPACE_OPTIONAL = "[ \\t\\u00A0]*";
const SEPARATOR = "[\\u2010-\\u2015-]";

const VERBS = {
  ro: {
    first: [
      "anun[țt]at",
      "avertizat",
      "afirmat",
      "acuzat",
      "ad[aă]ugat",
      "amintit",
      "amenin[tț]at",
      "conchis",
      "declarat",
      "[îi]ntrebat",
      "glumit",
      "men[tț]ionat",
      "precizat",
      "recunoscut",
      "replicat",
      "r[ăa]spuns",
      "ripostat",
      "spus",
      "specificat",
      "subliniat",
      "scris",
      "zis",
    ],
    second: [
      "aminte[sș]te",
      "amenin[tț][aă]",
      "avertizeaz[aă]",
      "adaug[aă]",
      "anun[tț][aă]",
      "afirm[aă]",
      "acuz[aă]",
      "crede",
      "conchide",
      "declar[ăa]",
      "[îi]ntreab[aă]",
      "glume[sș]te",
      "men[tț]ioneaz[ăa]",
      "precizeaz[aă]",
      "recunoa[sș]te",
      "r[ăa]spunde",
      "riposteaz[ăa]",
      "spera",
      "sus[tț]ine",
      "sugereaz[aă]",
      "specific[aă]",
      "subliniaz[aă]",
      "spune",
      "scrie",
      "zice",
    ],
    third: [
      "anun[țt]e",
      "avertizeze",
      "adauge",
      "aminteasc[aă]",
      "amenin[tț]e",
      "afirme",
      "acuze",
      "aminteasc[ăa]",
      "conchid[aă]",
      "declarare",
      "[îi]ntrebe",
      "glumeasc[ăa]",
      "men[tț]ioneze",
      "precizeze",
      "recunoasc[aă]",
      "r[ăa]spund[ăa]",
      "riposteze",
      "spun[aă]",
      "specifice",
      "sublinieze",
      "zic[aă]",
    ],
    us: ["[îi]ntreab[ăa]", "teme"],
  },
  ru: {
    common: [
      "рассказал(?:а)?",
      "сказал(?:а)?",
      "заявил(?:а)?",
      "отметил(?:а)?",
      "добавил(?:а)?",
      "рассказал(?:а)?",
      "подчеркнул(?:а)?",
      "говорит",
      "верит",
      "считает",
      "думает",
      "спрашивает",
      "напоминает",
      "признал(?:а)?",
      "ответил(?:а)?",
      "заключил(?:а)?",
      "заметил(?:а)?",
      "написал(?:а)?",
      "пояснил(?:а)?",
    ],
  },
  bg: {
    common: [
      "категоричен",
      "добавя",
      "коментира",
      "каза",
      "казва",
      "заяви",
      "призна",
      "разказва",
      "добави",
      "е заяви[^\\s\\.]+",
      "убеден",
      "попита",
      "уточни",
      "допълни",
      "обясни",
      "подчерта",
      "поясни",
      "завърши",
    ],
  },
  hu: {
    common: [
      "jelentette|utalt|magyarázta|mondta|fogalmazott|mesélte|tette hozzá|emelte ki|emlékeztetett|közölte",
    ],
  },
  it: {
    common: ["rilancia|hanno raccontato|ha detto|racconta|ha chiarito"],
  },
  cs: {
    common: [
      "dodal[áa]?|poznamenal[áa]?|vyčíslil|uvedl[áa]?|cituje|reaguje|plánuje|přidáv[áa]?|přiblížil[áa]?|myslí|připouští|tvrdí mluvčí|řekl[áa]?|sdělil[áa]?|upozornil[áa]?|snažil[áa]?|vysvětlil(?:á|a)?|doplnil[áa]?|potvrdil[áa]?|říká|dodává|oznámil|komentovala",
    ],
  },
  pl: {
    common: [
      "powiedział|mówił|mówi|podkreślał|podkreśla|dodaje|ocenił|odpowiada|zwrócił|zaznaczył|dodano|podkreślił|radzi",
    ],
  },
  en: {
    common: ["said", "added", "wrote", "told"],
  },
  es: {
    common: [
      "dijo",
      "añadió",
      "escribió",
      "afirmó",
      "explicó",
      "comentó",
      "subrayó",
      "declarado",
      "anticipó",
      "dicho",
      "sentenció",
      "reconocido",
      "explicaba",
    ],
  },
};

function verbs(list: string[]): string {
  return "(?:" + list.join("|") + ")";
}

const DATA: Record<string, any> = {
  // ...existing code...
};

const RULES: Record<string, Rule[]> = {};

function formatQuoteBody(qMarks: string[]): string {
  return QUOTE.replace(/]/, qMarks.join("") + "]");
}

function init() {
  LANGUAGES.forEach((lang) => {
    RULES[lang] = DATA[lang]?.regs ? [...DATA[lang].regs] : [];
    const data = DATA[lang];
    if (data?.end) {
      data.end.forEach((word: string) => {
        data.quoteMarks.forEach((qMarks: string[]) => {
          const pattern =
            qMarks[0] + formatQuoteBody(qMarks) + qMarks[1] + word;
          RULES[lang].push({
            reg: new RegExp(pattern, "gi"),
            name: 1,
            quote: 0,
          });
        });
      });
    }
    if (data?.start) {
      data.start.forEach((word: string) => {
        data.quoteMarks.forEach((qMarks: string[]) => {
          const pattern =
            word + qMarks[0] + formatQuoteBody(qMarks) + qMarks[1];
          RULES[lang].push({
            reg: new RegExp(pattern, "gi"),
            name: 0,
            quote: 1,
          });
        });
      });
    }
  });
}

// Migrare completă a datelor din config.original.js
// --- DATA object migration ---
Object.assign(DATA, {
  ro: {
    quoteMarks: [
      QUOTE_MARKS[0],
      QUOTE_MARKS[1],
      QUOTE_MARKS[2],
      QUOTE_MARKS[3],
      QUOTE_MARKS[4],
      QUOTE_MARKS[8],
    ],
    start: [
      START_NAME +
        ",?" +
        NAME_SPACE +
        "(?:a|i-a)(?: mai)?" +
        NAME_SPACE +
        verbs(VERBS.ro.first) +
        "(?: c[ăa])?:" +
        NAME_SPACE,
      START_NAME +
        ",?(?: mai)?" +
        NAME_SPACE +
        verbs(VERBS.ro.second) +
        "(?: c[ăa])?:" +
        NAME_SPACE,
      LONG_START_NAME + ":" + NAME_SPACE,
      // general
      START_NAME +
        NAME_SPACE +
        "(?:a|i-a|l-a)?" +
        NAME_SPACE_OPTIONAL +
        verbs([...VERBS.ro.first, ...VERBS.ro.second]) +
        NAME_SPACE +
        `(?:[^\\.\\n${ALL_QUOTE_MARKS}]+)?` +
        "(?:c[ăa]|\\:)" +
        NAME_SPACE,
    ],
    end: [
      ",?" + NAME_SPACE + verbs(VERBS.ro.second) + NAME_SPACE + END_NAME,
      ",?" +
        NAME_SPACE +
        "(?:a|i-a)(?: mai)?" +
        NAME_SPACE +
        verbs(VERBS.ro.first) +
        NAME_SPACE +
        END_NAME,
      ",?" +
        NAME_SPACE +
        "a(?: mai)? (?:[țt]inut|dorit) s[aă] " +
        verbs(VERBS.ro.third) +
        NAME_SPACE +
        END_NAME,
      ",?" +
        NAME_SPACE +
        "(?:se|ne)(?: mai)?" +
        NAME_SPACE +
        verbs(VERBS.ro.us) +
        NAME_SPACE +
        END_NAME,
    ],
  },
  ru: {
    quoteMarks: [
      QUOTE_MARKS[0],
      QUOTE_MARKS[1],
      QUOTE_MARKS[2],
      QUOTE_MARKS[3],
      QUOTE_MARKS[4],
    ],
    end: [
      ",?" +
        NAME_SPACE +
        "(?:" +
        SEPARATOR +
        "?[ \t]+)?" +
        verbs(VERBS.ru.common) +
        NAME_SPACE +
        END_NAME,
    ],
    start: [START_NAME + ":" + NAME_SPACE],
  },
  bg: {
    quoteMarks: [
      QUOTE_MARKS[1],
      QUOTE_MARKS[2],
      QUOTE_MARKS[3],
      QUOTE_MARKS[4],
    ],
    end: [
      ",?" +
        NAME_SPACE +
        "(?:" +
        SEPARATOR +
        "?[ \t]+)?" +
        verbs(VERBS.bg.common) +
        NAME_SPACE +
        END_NAME,
    ],
  },
  hu: {
    end: [
      NAME_SPACE_OPTIONAL +
        SEPARATOR +
        NAME_SPACE_OPTIONAL +
        verbs(VERBS.hu.common) +
        NAME_SPACE +
        END_NAME,
    ],
    quoteMarks: [
      QUOTE_MARKS[0],
      QUOTE_MARKS[2],
      QUOTE_MARKS[3],
      QUOTE_MARKS[7],
    ],
  },
  it: {
    end: [",?" + NAME_SPACE + verbs(VERBS.it.common) + NAME_SPACE + END_NAME],
    quoteMarks: [QUOTE_MARKS[1], QUOTE_MARKS[3]],
  },
  cs: {
    end: [NAME_SPACE + verbs(VERBS.cs.common) + NAME_SPACE + END_NAME],
    quoteMarks: [QUOTE_MARKS[3]],
  },
  pl: {
    end: [
      NAME_SPACE +
        SEPARATOR +
        NAME_SPACE +
        verbs(VERBS.pl.common) +
        NAME_SPACE +
        END_NAME,
    ],
    quoteMarks: [QUOTE_MARKS[3]],
    regs: [
      {
        reg: new RegExp(
          "\n- " +
            QUOTE +
            NAME_SPACE +
            SEPARATOR +
            NAME_SPACE +
            verbs(VERBS.pl.common) +
            NAME_SPACE +
            END_NAME,
          "gi"
        ),
        name: 1,
        quote: 0,
      },
    ],
  },
  en: {
    quoteMarks: [QUOTE_MARKS[2], QUOTE_MARKS[3]],
    start: [
      START_NAME + NAME_SPACE + verbs(VERBS.en.common) + ":" + NAME_SPACE,
    ],
    end: [
      NAME_SPACE + verbs(VERBS.en.common) + NAME_SPACE + END_NAME,
      NAME_SPACE + START_NAME + NAME_SPACE + verbs(VERBS.en.common),
      NAME_SPACE_OPTIONAL + SEPARATOR + NAME_SPACE_OPTIONAL + START_NAME,
      NAME_SPACE_OPTIONAL +
        "[\n\r]+" +
        NAME_SPACE_OPTIONAL +
        SEPARATOR +
        NAME_SPACE_OPTIONAL +
        START_NAME +
        "(?:$|[\n\r])",
    ],
  },
  es: {
    quoteMarks: [
      QUOTE_MARKS[0],
      QUOTE_MARKS[1],
      QUOTE_MARKS[2],
      QUOTE_MARKS[3],
    ],
    start: [
      START_NAME +
        NAME_SPACE +
        verbs(VERBS.es.common) +
        `(?: que)?` +
        NAME_SPACE,
      verbs(VERBS.es.common) + START_NAME + ":" + NAME_SPACE_OPTIONAL,
    ],
    end: [
      `,?` +
        `(?: ha)?` +
        NAME_SPACE +
        verbs(VERBS.es.common) +
        NAME_SPACE +
        END_NAME,
      NAME_SPACE + START_NAME + NAME_SPACE + verbs(VERBS.es.common),
      NAME_SPACE_OPTIONAL + SEPARATOR + NAME_SPACE_OPTIONAL + START_NAME,
    ],
  },
});

init();

export function rules(lang: Language | string): Rule[] {
  return RULES[lang] || [];
}

export function languages(): Language[] {
  return [...LANGUAGES];
}

export function isValidLanguage(lang: string): boolean {
  return LANGUAGES.includes(lang as Language);
}
