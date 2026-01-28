export const needsMermaid = (body?: string) =>
  Boolean(body && /(^|\n)```mermaid\b/.test(body));

export const needsKatex = (body?: string) => {
  if (!body) return false;
  if (/(^|\n)\$\$/.test(body)) return true;
  if (/\\\(|\\\[|\\begin\{/.test(body)) return true;
  return /\$[^$\n]+\$/.test(body);
};

