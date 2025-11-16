export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function omit<T extends Record<string, unknown>>(
  obj: T,
  keysToOmit: string[]
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToOmit.includes(key))
  );
}

export function pick<T extends Record<string, unknown>>(
  obj: T,
  keysToPick: string[]
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keysToPick.includes(key))
  );
}
