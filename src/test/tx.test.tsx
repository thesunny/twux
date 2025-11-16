import { tx } from "..";
import { describe, it, expect } from "vitest";

describe("tx", () => {
  it("should be defined", () => {
    expect(tx).toBeDefined();
  });

  it("should merge classes with last class taking precedence", () => {
    const className = tx("bg-red-500", "bg-blue-500");
    expect(className).toBe("bg-blue-500");

    const className2 = tx("bg-red-500", "bg-blue-500", "bg-green-500");
    expect(className2).toBe("bg-green-500");
  });
});
