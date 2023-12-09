export function prettify(value: string, n?: number) {
  const [front, back] = value.split(".");
  if (back) {
    return parseInt(front).toLocaleString() + "." + back.slice(0, n ?? 2);
  }
  return parseInt(front).toLocaleString();
}
