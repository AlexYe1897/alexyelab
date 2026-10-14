// @ts-check
import katex from 'katex';
import { defineMdastPlugin } from 'satteri';

/**
 * @param {string} source
 * @param {boolean} displayMode
 */
function renderFormula(source, displayMode) {
  const html = katex.renderToString(source, {
    displayMode,
    output: 'htmlAndMathml',
    throwOnError: true,
    trust: false,
    maxSize: 20,
    maxExpand: 1000,
    macros: {},
  });

  return displayMode
    ? `<div class="math-block" role="group" aria-label="数学公式" tabindex="0">${html}</div>`
    : html;
}

export const markdownMath = defineMdastPlugin({
  name: 'alexyelab-math',
  math(node, context) {
    context.replaceNode(node, {
      type: 'html',
      value: renderFormula(node.value, true),
    });
  },
  inlineMath(node, context) {
    context.replaceNode(node, {
      type: 'html',
      value: renderFormula(node.value, false),
    });
  },
});
