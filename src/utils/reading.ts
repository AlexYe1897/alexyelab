export function getReadingStats(markdown: string) {
  const readableText = markdown
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, ' ')
    .replace(/^(?: {4}|\t).*$/gm, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}(?:#{1,6}\s+|>\s?|[-+*]\s+|\d+[.)]\s+)/gm, '')
    .replace(/[*_~`]/g, ' ');

  const chineseCharacterCount = (readableText.match(/\p{Script=Han}/gu) ?? [])
    .length;
  const englishWordCount = (
    readableText.match(/\b[A-Za-z]+(?:['’-][A-Za-z]+)*\b/g) ?? []
  ).length;

  return {
    wordCount: chineseCharacterCount + englishWordCount,
    readingTime: Math.max(
      1,
      Math.ceil(chineseCharacterCount / 300 + englishWordCount / 200),
    ),
  };
}
