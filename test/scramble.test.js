import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newNumber, newLetter, scrambleHtml } from '../src/scramble.js';

test('no number stays the same', () => {
  for (const old of ['0', '7', '42', '843', '007', '2025']) {
    for (let i = 0; i < 500; i++) assert.notEqual(Number(newNumber(old)), Number(old));
  }
});

test('length changes by at most one digit', () => {
  for (let i = 0; i < 500; i++) {
    const length = newNumber('843', 1).length;
    assert.ok(length === 2 || length === 4, `got length ${length}`);
    assert.equal(newNumber('843', 0).length, 3);
  }
});

test('no letter stays the same and the case is kept', () => {
  for (let i = 0; i < 500; i++) {
    assert.match(newLetter('a'), /^[b-z]$/);
    assert.match(newLetter('Z'), /^[A-Y]$/);
    assert.match(newLetter('ä'), /^[a-z]$/);
    assert.match(newLetter('Ü'), /^[A-Z]$/);
  }
});

const HTML = `<html><head><title>Report 2025</title></head>
<body class="p-4" data-x="12"><p>Umsatz 843&nbsp;€ und 12%</p><img src="pic1.png" width="300" alt="Bild">
<script>var x = 42;</script><style>.a{width:100px}</style><!-- 999 --></body></html>`;
const KEPT = ['Report 2025', 'class="p-4"', 'data-x="12"', 'pic1.png', 'width="300"', 'alt="Bild"', 'var x = 42;', 'width:100px', '<!-- 999 -->', '&nbsp;'];
const paragraph = (html) => html.match(/<p>(.*)<\/p>/)[1];

test('numbers only: letters and markup stay', () => {
  const out = scrambleHtml(HTML);
  for (const kept of KEPT) assert.ok(out.includes(kept), `missing: ${kept}`);
  const text = paragraph(out);
  assert.match(text, /^Umsatz \d+&nbsp;€ und \d+%$/);
  assert.ok(!text.includes(' 843&') && !text.includes(' 12%'));
});

test('letters only: numbers and markup stay', () => {
  const out = scrambleHtml(HTML, { numbers: false, letters: true });
  for (const kept of KEPT) assert.ok(out.includes(kept), `missing: ${kept}`);
  const text = paragraph(out);
  assert.match(text, /^[A-Z][a-z]{5} 843&nbsp;€ [a-z]{3} 12%$/);
  assert.ok(!text.startsWith('Umsatz') && !text.includes(' und '));
});

test('numbers and letters', () => {
  const out = scrambleHtml(HTML, { numbers: true, letters: true });
  for (const kept of KEPT) assert.ok(out.includes(kept), `missing: ${kept}`);
  const text = paragraph(out);
  assert.match(text, /^[A-Z][a-z]{5} \d+&nbsp;€ [a-z]{3} \d+%$/);
  assert.ok(!text.startsWith('Umsatz') && !text.includes(' 843&'));
});

test('numeric entities are not scrambled', () => {
  assert.match(scrambleHtml('<p>1&#160;000&#x20AC;</p>'), /^<p>\d+&#160;\d+&#x20AC;<\/p>$/);
});

test('fragment without <body> is scrambled completely', () => {
  assert.doesNotMatch(scrambleHtml('<p>Total: 5</p>'), /Total: 5</);
  assert.doesNotMatch(scrambleHtml('<p>Total: 5</p>', { numbers: false, letters: true }), /Total/);
});
