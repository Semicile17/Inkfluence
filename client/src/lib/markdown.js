export const slugifyHeading = (text = '') =>
  text
    .toLowerCase()
    .replace(/[`*_~[\]()]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

const stripInline = (text = '') =>
  text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .trim();

export function extractHeadings(markdown = '') {
  const headings = [];
  let inCodeBlock = false;

  for (const line of markdown.split('\n')) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const text = stripInline(match[2]);
      headings.push({
        level: match[1].length,
        text,
        id: slugifyHeading(text),
      });
    }
  }

  return headings;
}
