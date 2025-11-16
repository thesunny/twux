import { twux } from "..";
import { describe, it, expect } from "vitest";
import "./test-utils";

describe("twux", () => {
  describe("default class names", () => {
    it("should render a div with a twuxed className", () => {
      const $div = twux("bg-red-500", "div");
      expect(<$div />).toRenderAs(<div className="bg-red-500" />);
    });

    it("should allow you to override the default class name with a prop", () => {
      const $div = twux("bg-red-500", "div");
      expect(<$div className="bg-blue-500" />).toRenderAs(
        <div className="bg-blue-500" />
      );
    });
  });

  describe("default class names", () => {
    it("should should work with a button", () => {
      const $div = twux("bg-red-500", "button");
      expect(<$div />).toRenderAs(<button className="bg-red-500" />);
    });

    it("should work with a heading", () => {
      const $div = twux("bg-red-500", "h1");
      expect(<$div />).toRenderAs(<h1 className="bg-red-500" />);
    });

    it("should give ts error with an invalid element", () => {
      // @ts-expect-error - "wtf" is not a valid HTML element type
      twux("bg-red-500", "invalid-element-type");
      expect(true).toBe(true);
    });
  });

  describe("single classifier", () => {
    it("should work with a classifier", () => {
      const $button = twux(
        "text-sm",
        {
          variant: {
            primary: "bg-blue-500 text-white",
            danger: "bg-red-500 text-white",
          },
        },
        "button"
      );
      expect(<$button variant="primary" />).toRenderAs(
        <button className="text-sm bg-blue-500 text-white" />
      );
      expect(<$button variant="danger" />).toRenderAs(
        <button className="text-sm bg-red-500 text-white" />
      );
      // @ts-expect-error - variant is required
      <$button />;
    });
  });
});
