function normalizeTag(tag: string) {
  return tag
    .normalize('NFKC')
    .trim()
    .replace(/\s+/gu, ' ')
    .toLocaleLowerCase('en-US');
}

function createShortHash(value: string) {
  let hash = 2166136261;

  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36).padStart(7, '0').slice(0, 7);
}

export function toTagSlug(tag: string) {
  const normalizedTag = normalizeTag(tag);
  const containsMeaningfulSpecialCharacter =
    /[^\p{L}\p{N}\s_-]/u.test(normalizedTag);

  const readableTag = normalizedTag
    .replace(/\+/gu, ' plus ')
    .replace(/#/gu, ' sharp ')
    .replace(/&/gu, ' and ')
    .replace(/@/gu, ' at ');

  const baseSlug =
    readableTag
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/gu, '') || 'tag';

  return containsMeaningfulSpecialCharacter
    ? `${baseSlug}-${createShortHash(normalizedTag)}`
    : baseSlug;
}
