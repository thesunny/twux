export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keysToOmit: K[]
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToOmit.includes(key as K))
  ) as Omit<T, K>;
}
