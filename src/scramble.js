// Replaces every number in the visible <body> text of an HTML document with a random other number

const NUMBER = /\d+/g;
// Tags, comments and the content of script/style/textarea stay untouched
const UNTOUCHED = /<!--[\s\S]*?-->|<(script|style|textarea)\b[\s\S]*?<\/\1\s*>|<[^>]*>/gi;
const BODY = /(<body\b[^>]*>)([\s\S]*)(<\/body\s*>)/i;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const withoutLeadingZeros = (s) => s.replace(/^0+/, '');

/**
 * Random number that differs from `old`. With probability `lengthRate` it gets
 * one digit more or less (843 → 2432 or 24).
 */
export function newNumber(old, lengthRate = 0.3) {
  let length = old.length;
  if (Math.random() < lengthRate) {
    length += length > 1 ? (Math.random() < 0.5 ? -1 : 1) : 1;
  }
  while (true) {
    let digits = String(length === 1 ? randomInt(0, 9) : randomInt(1, 9));
    for (let i = 1; i < length; i++) digits += randomInt(0, 9);
    if (digits !== old && withoutLeadingZeros(digits) !== withoutLeadingZeros(old)) return digits;
  }
}

export const scrambleText = (text, lengthRate) =>
  text.replace(NUMBER, (old) => newNumber(old, lengthRate));

/** Scrambles the numbers in text nodes only, markup is kept as is. */
export function scrambleMarkup(markup, lengthRate) {
  const parts = [];
  let pos = 0;
  for (const m of markup.matchAll(UNTOUCHED)) {
    parts.push(scrambleText(markup.slice(pos, m.index), lengthRate));
    parts.push(m[0]);
    pos = m.index + m[0].length;
  }
  parts.push(scrambleText(markup.slice(pos), lengthRate));
  return parts.join('');
}

/** Scrambles the <body> of a document, or the whole input if it is a fragment without <body>. */
export function scrambleHtml(html, lengthRate = 0.3) {
  const m = html.match(BODY);
  if (!m) return scrambleMarkup(html, lengthRate);
  const start = m.index + m[1].length;
  return html.slice(0, start) + scrambleMarkup(m[2], lengthRate) + html.slice(start + m[2].length);
}
