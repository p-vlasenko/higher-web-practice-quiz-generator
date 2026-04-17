const BASE = process.env.BASE_URL ?? '';

export const url = (p: string) => {
  if (!BASE) {
    return p.startsWith('/') ? p : '/' + p
  };

  const b = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;

  return `${b}${p.startsWith('/') ? p : '/' + p}`;
};
