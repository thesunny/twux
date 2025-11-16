import { renderToStaticMarkup } from "react-dom/server";
import { expect } from "vitest";
import type { ReactElement } from "react";

/**
 * Custom Vitest matcher to compare rendered HTML output of two React elements
 */
expect.extend({
  toRenderAs(received: ReactElement, expected: ReactElement) {
    const receivedHtml = renderToStaticMarkup(received);
    const expectedHtml = renderToStaticMarkup(expected);

    const pass = receivedHtml === expectedHtml;

    return {
      pass,
      message: () =>
        pass
          ? `Expected elements NOT to render the same HTML`
          : `Expected elements to render the same HTML\n\nReceived: ${receivedHtml}\nExpected: ${expectedHtml}`,
    };
  },
});

/**
 * Helper function to render a React element to static HTML
 */
export function renderToHtml(element: ReactElement): string {
  return renderToStaticMarkup(element);
}

/**
 * TypeScript declaration for the custom matcher
 */
declare module "vitest" {
  interface Assertion<T = any> {
    toRenderAs(expected: ReactElement): T;
  }
  interface AsymmetricMatchersContaining {
    toRenderAs(expected: ReactElement): any;
  }
}
