export type Bag = Record<string, number>;
export function sanitizeBag(value: unknown, ids: readonly string[]): Bag {
  const bag: Bag = {};
  const valid = new Set(ids);
  const entries = Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? Object.entries(value)
      : [];
  for (const entry of entries) {
    if (!Array.isArray(entry) || entry.length !== 2) continue;
    const [id, n] = entry;
    if (
      typeof id === "string" &&
      valid.has(id) &&
      Number.isInteger(n) &&
      n > 0 &&
      n <= 99
    )
      bag[id] = n;
  }
  return bag;
}
export function addItems(
  bag: Bag,
  items: { id: string; quantity: number }[],
  ids: readonly string[],
): Bag {
  const next = { ...sanitizeBag(bag, ids) };
  for (const { id, quantity } of items) {
    if (ids.includes(id) && Number.isInteger(quantity) && quantity > 0)
      next[id] = Math.min(99, (next[id] || 0) + quantity);
  }
  return next;
}
