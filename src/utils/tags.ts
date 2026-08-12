export function toTagSlug(tag: string) {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}
