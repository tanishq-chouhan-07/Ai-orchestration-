const DEFAULT_REDACT_KEYS = ["password", "token", "apiKey", "secret", "authorization"];

function redactValue(value: unknown) {
  if (typeof value === "string") return "[REDACTED]";
  if (typeof value === "number") return 0;
  if (value === null || value === undefined) return value;
  return "[REDACTED]";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function redactObject(input: unknown, keys: string[] = DEFAULT_REDACT_KEYS): unknown {
  if (Array.isArray(input)) {
    return input.map((item) => redactObject(item, keys));
  }

  if (isPlainObject(input)) {
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      if (keys.includes(key)) {
        output[key] = redactValue(value);
      } else {
        output[key] = redactObject(value, keys);
      }
    }
    return output;
  }

  return input;
}
