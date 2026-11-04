// Makes the visible <body> text of an HTML document unreadable: numbers, letters or both

const NUMBER = /\d+/g;
const LETTER = /\p{L}/gu;
// Tags, comments, entities (&nbsp; &#160;) and the content of script/style/textarea stay untouched
const UNTOUCHED = /<!--[\s\S]*?-->|<(script|style|textarea)\b[\s\S]*?<\/\1\s*>|<[^>]*>|&(?:#\d+|#x[\da-f]+|[a-z][a-z\d]*);/gi;
const BODY = /(<body\b[^>]*>)([\s\S]*)(<\/body\s*>)/i;

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';

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

/** Random other ASCII letter in the same case (umlauts and other letters become ASCII too). */
export function newLetter(old) {
  const letters = old === old.toLowerCase() && old !== old.toUpperCase() ? LOWER : UPPER;
  while (true) {
    const letter = letters[randomInt(0, letters.length - 1)];
    if (letter !== old) return letter;
  }
}

export function scrambleText(text, { numbers = true, letters = false, rate = 0.3 } = {}) {
  if (numbers) text = text.replace(NUMBER, (old) => newNumber(old, rate));
  if (letters) text = text.replace(LETTER, newLetter);
  return text;
}

/** Scrambles text nodes only, markup is kept as is. */
export function scrambleMarkup(markup, options) {
  const parts = [];
  let pos = 0;
  for (const m of markup.matchAll(UNTOUCHED)) {
    parts.push(scrambleText(markup.slice(pos, m.index), options));
    parts.push(m[0]);
    pos = m.index + m[0].length;
  }
  parts.push(scrambleText(markup.slice(pos), options));
  return parts.join('');
}

/**
 * Scrambles the <body> of a document, or the whole input if it is a fragment without <body>.
 * Options: `numbers` (default true), `letters` (default false), `rate` for numbers (default 0.3).
 */
export function scrambleHtml(html, options = {}) {
  const m = html.match(BODY);
  if (!m) return scrambleMarkup(html, options);
  const start = m.index + m[1].length;
  return html.slice(0, start) + scrambleMarkup(m[2], options) + html.slice(start + m[2].length);
}
