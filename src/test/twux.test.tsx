import { twux } from "..";
import { describe, it, expect } from "vitest";
import "./test-utils";

describe("twux", () => {
  describe("default class names with element", () => {
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

    it("should pass through other props to the element", () => {
      const $div = twux("bg-red-500", "div");
      expect(<$div data-testid="test-id" />).toRenderAs(
        <div data-testid="test-id" className="bg-red-500" />
      );
    });
  });

  describe("default class names with different elements", () => {
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

  describe("class names with function component", () => {
    it("should work with a function component", () => {
      const $button = twux("bg-red-500", (props) => (
        <button {...props}>Click me</button>
      ));
      expect(<$button />).toRenderAs(
        <button className="bg-red-500">Click me</button>
      );
      expect(<$button className="bg-blue-500" />).toRenderAs(
        <button className="bg-blue-500">Click me</button>
      );
    });
  });

  describe("single classifier with string values", () => {
    it("should work with a classifier", () => {
      const $button = twux(
        "text-sm",
        {
          bold: "font-bold",
          italic: "font-italic",
        },
        "button"
      );
      expect(<$button bold />).toRenderAs(
        <button className="text-sm font-bold" />
      );
      expect(<$button italic />).toRenderAs(
        <button className="text-sm font-italic" />
      );
      expect(<$button bold italic />).toRenderAs(
        <button className="text-sm font-bold font-italic" />
      );
      expect(<$button />).toRenderAs(<button className="text-sm" />);
    });
  });

  describe("single classifier with object values", () => {
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

  describe("single classifier with mixed string and object values", () => {
    it("should work with a classifier", () => {
      const $button = twux(
        "text-sm",
        {
          bold: "font-bold",
          italic: "font-italic",
          variant: {
            primary: "bg-blue-500 text-white",
            danger: "bg-red-500 text-white",
          },
        },
        "button"
      );
      expect(<$button bold variant="primary" />).toRenderAs(
        <button className="text-sm font-bold bg-blue-500 text-white" />
      );
      expect(<$button italic variant="primary" />).toRenderAs(
        <button className="text-sm font-italic bg-blue-500 text-white" />
      );
      expect(<$button bold italic variant="primary" />).toRenderAs(
        <button className="text-sm font-bold font-italic bg-blue-500 text-white" />
      );
      expect(<$button variant="danger" />).toRenderAs(
        <button className="text-sm bg-red-500 text-white" />
      );
      expect(<$button bold italic variant="danger" />).toRenderAs(
        <button className="text-sm font-bold font-italic bg-red-500 text-white" />
      );
      // @ts-expect-error - variant is required
      <$button />;
    });
  });

  describe("multiple classifiers", () => {
    it("should work with a classifier", () => {
      const $button = twux(
        "rounded-md",
        {
          variant: {
            primary: "bg-blue-500 text-white",
            danger: "bg-red-500 text-white",
          },
          size: {
            small: "text-sm",
            medium: "text-base",
            large: "text-lg",
          },
        },
        "button"
      );
      expect(<$button variant="primary" size="small" />).toRenderAs(
        <button className="rounded-md bg-blue-500 text-white text-sm" />
      );
      expect(<$button variant="danger" size="small" />).toRenderAs(
        <button className="rounded-md bg-red-500 text-white text-sm" />
      );
      expect(<$button variant="primary" size="medium" />).toRenderAs(
        <button className="rounded-md bg-blue-500 text-white text-base" />
      );
      expect(<$button variant="danger" size="large" />).toRenderAs(
        <button className="rounded-md bg-red-500 text-white text-lg" />
      );
      // @ts-expect-error - size is required
      <$button variant="primary" />;
      // @ts-expect-error - variant is required
      <$button size="small" />;
    });
  });

  describe("object classifier with default values", () => {
    it("should work with a classifier", () => {
      const $button = twux(
        "text-sm",
        {
          variant: {
            primary: "bg-blue-500 text-white",
            danger: "bg-red-500 text-white",
          },
        },
        {
          variant: "primary",
        },
        "button"
      );
      expect(<$button />).toRenderAs(
        <button className="text-sm bg-blue-500 text-white" />
      );
      expect(<$button variant="danger" />).toRenderAs(
        <button className="text-sm bg-red-500 text-white" />
      );
    });
  });

  describe("class names with function component and classifier", () => {
    it("should work with a function component and classifier", () => {
      const $button = twux(
        "rounded-md",
        {
          variant: {
            primary: "bg-blue-500 text-white",
            danger: "bg-red-500 text-white",
          },
        },
        (props) => <button {...props}>Click me</button>
      );
      expect(<$button variant="primary" />).toRenderAs(
        <button className="rounded-md bg-blue-500 text-white">Click me</button>
      );
      expect(<$button variant="danger" />).toRenderAs(
        <button className="rounded-md bg-red-500 text-white">Click me</button>
      );
    });
  });

  describe("function component typescript types", () => {
    it("should work with a function component and type checking", () => {
      const $button = twux(
        "bg-red-500",
        ({ number, ...props }: { className?: string; number: number }) => (
          <button {...props}>{number}</button>
        )
      );
      // @ts-expect-error - number is not a number
      <$button number={"text"} />;

      expect(<$button number={1} />).toRenderAs(
        <button className="bg-red-500">1</button>
      );
      expect(<$button number={2} className="bg-blue-500" />).toRenderAs(
        <button className="bg-blue-500">2</button>
      );
    });
  });
});
