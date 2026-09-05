import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import subsetFont from 'subset-font';

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, 'src');
const sourceFontPath = path.join(
  sourceRoot,
  'assets',
  'font-source',
  'noto-sans-sc-variable.woff2',
);
const outputFontPath = path.join(
  projectRoot,
  'public',
  'fonts',
  'noto-sans-sc-site.woff2',
);
const sourceExtensions = new Set(['.astro', '.css', '.md', '.ts']);
const isChineseGlyph = (character) =>
  /[\p{Script=Han}\u2e80-\u2fff\u3000-\u303f\u31c0-\u31ef\u3400-\u4dbf\uf900-\ufaff\ufe30-\ufe4f\uff00-\uffef]/u.test(
    character,
  );

const listSourceFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);

      return entry.isDirectory() ? listSourceFiles(entryPath) : [entryPath];
    }),
  );

  return files.flat();
};

const sourceFiles = (await listSourceFiles(sourceRoot)).filter((file) =>
  sourceExtensions.has(path.extname(file)),
);
const sourceText = (
  await Promise.all(sourceFiles.map((file) => readFile(file, 'utf8')))
).join('\n');
const requiredCharacters = [...new Set([...sourceText].filter(isChineseGlyph))]
  .sort((a, b) => a.codePointAt(0) - b.codePointAt(0))
  .join('');

if (!requiredCharacters) {
  throw new Error('No Chinese characters were found in the site source.');
}

const sourceFont = await readFile(sourceFontPath);
const optimizedFont = await subsetFont(sourceFont, requiredCharacters, {
  targetFormat: 'woff2',
});

await mkdir(path.dirname(outputFontPath), { recursive: true });
await writeFile(outputFontPath, optimizedFont);

const outputSize = (await stat(outputFontPath)).size;
console.log(
  `Built Chinese font subset: ${requiredCharacters.length} characters, ${Math.round(outputSize / 1024)} KiB.`,
);
