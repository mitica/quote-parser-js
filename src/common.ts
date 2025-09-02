export type Rule = { reg: RegExp; name: number; quote: number };

export interface Quote<TPerson extends Person = Person> {
  index: number;
  text: string;
  name: {
    index: number;
    text: string;
  };
  author?: TPerson;
}

export interface Person {
  index: number;
  id: number | string;
}

export interface ParseOptions<TPerson extends Person = Person> {
  minLength?: number;
  persons?: Array<TPerson>;
  extraRules?: Array<Rule>;
}
