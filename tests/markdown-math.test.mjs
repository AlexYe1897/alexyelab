import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { markdownToHtml } from 'satteri';
import { markdownMath } from '../src/utils/markdown-math.mjs';

async function render(source) {
  return markdownToHtml(source, {
    features: { math: true },
    mdastPlugins: [markdownMath],
  }).html;
}

test('inline formulas preserve subscripts and supply accessible MathML', async () => {
  const html = await render('向量 $x_1 = \\frac{a}{b}$ 与正文同行。');
  assert.match(html, /class="katex"/);
  assert.match(html, /<math[^>]*>/);
  assert.match(html, /<msub>/);
  assert.match(html, /<mfrac>/);
  assert.match(html, /aria-hidden="true"/);
  assert.doesNotMatch(html, /class="math-block"/);
});

test('display matrices and aligned equations use keyboard-scrollable blocks', async () => {
  const html = await render(String.raw`$$
X=\begin{bmatrix}1&2\\3&4\end{bmatrix}
$$

$$
\begin{aligned}Q&=XW^Q\\K&=XW^K\end{aligned}
$$`);
  assert.equal((html.match(/class="math-block"/g) ?? []).length, 2);
  assert.equal((html.match(/class="katex-display"/g) ?? []).length, 2);
  assert.match(html, /<mtable/);
  assert.match(html, /tabindex="0"/);
  assert.doesNotMatch(html, /katex-error/);
});

test('inline code, code fences and escaped dollar signs stay literal', async () => {
  const html = await render(
    '`$x_1$`\n\n```text\n$$\\frac{1}{2}$$\n```\n\n价格 \\$15。',
  );
  assert.match(html, /<code>\$x_1\$<\/code>/);
  assert.match(html, /<pre><code[^>]*>\$\$\\frac\{1\}\{2\}\$\$/);
  assert.match(html, /价格 \$15/);
  assert.doesNotMatch(html, /class="katex"/);
});

test('invalid formula syntax fails during rendering instead of shipping raw text', async () => {
  await assert.rejects(() => render('$\\frac{1}{$'), /KaTeX parse error/);
});

test('formula input cannot enable unsafe HTML or JavaScript links', async () => {
  const html = await render(String.raw`$\href{javascript:alert(1)}{x}$`);
  assert.doesNotMatch(html, /href="javascript:/);
  assert.doesNotMatch(html, /<script/);
});

test('the current reading-notes article renders without formula errors', async () => {
  const article = await readFile(
    new URL(
      '../src/content/blog/2026-10-14-Taming-the-Titans-第2节与第3节阅读笔记.md',
      import.meta.url,
    ),
    'utf8',
  );
  const body = article.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const html = await render(body);
  assert.ok((html.match(/class="katex"/g) ?? []).length > 40);
  assert.ok((html.match(/class="math-block"/g) ?? []).length > 10);
  assert.doesNotMatch(html, /katex-error/);
  assert.doesNotMatch(html, /<p>\$\$/);
});
