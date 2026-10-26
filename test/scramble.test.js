import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newNumber, scrambleHtml } from '../src/scramble.js';

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

test('only body text is changed', () => {
  const html = `<html><head><title>Report 2025</title></head>
<body class="p-4" data-x="12"><p>843 € and 12%</p><img src="pic1.png" width="300">
<script>var x = 42;</script><style>.a{width:100px}</style><!-- 999 --></body></html>`;
  const out = scrambleHtml(html, 0.3);
  for (const kept of ['Report 2025', 'data-x="12"', 'pic1.png', 'width="300"', 'var x = 42;', 'width:100px', '<!-- 999 -->']) {
    assert.ok(out.includes(kept), `missing: ${kept}`);
  }
  const text = out.match(/<p>(.*)<\/p>/)[1];
  assert.match(text, /^\d+ € and \d+%$/);
  assert.ok(!text.includes('843 ') && !text.startsWith('12%'));
});

test('fragment without <body> is scrambled completely', () => {
  assert.doesNotMatch(scrambleHtml('<p>Total: 5</p>'), /Total: 5</);
});
