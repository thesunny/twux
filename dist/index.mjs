// src/index.tsx
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

// src/utils.ts
function isString(value) {
  return typeof value === "string";
}
function isFunction(value) {
  return typeof value === "function";
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function omit(obj, keysToOmit) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToOmit.includes(key))
  );
}

// src/index.tsx
import { twMerge as twMerge2 } from "tailwind-merge";
import { jsx } from "react/jsx-runtime";
function getJsxElementFromArgs(...args) {
  for (const arg of args) {
    if (isString(arg)) return { type: "tag-name", tag: arg };
    if (isFunction(arg)) return { type: "function-component", fn: arg };
  }
  throw new Error(
    "You must provide either a JSX tag (string) or a function component (function) as argument 2, 3, or 4"
  );
}
function mergeClassNamesIntoProps({ className, ...props }, ...classes) {
  const nextClassName = twMerge(...classes, className);
  return { ...props, className: nextClassName };
}
function twux(className, arg2, arg3, arg4) {
  const maybeClassifier = isRecord(arg2) ? arg2 : void 0;
  const maybeDefaultValues = maybeClassifier && isRecord(arg3) ? arg3 : {};
  function classify(incomingProps) {
    const classNames = [className];
    if (!maybeClassifier) return classNames;
    for (const [key, value] of Object.entries(maybeClassifier)) {
      if (isString(value)) {
        if (key in incomingProps ? incomingProps[key] : maybeDefaultValues[key]) {
          classNames.push(value);
        }
        continue;
      }
      if (isRecord(value)) {
        Object.entries(value).forEach(([k, v]) => {
          if (key in incomingProps ? incomingProps[key] === k : maybeDefaultValues[key] === k) {
            classNames.push(v);
          }
        });
        continue;
      }
      throw new Error(
        `Invalid classifier value: ${value}. Classifier values must be a string or an object with string keys.`
      );
    }
    return classNames;
  }
  const jsxElem = getJsxElementFromArgs(arg2, arg3, arg4);
  return forwardRef(
    function __twux_component__({ className: className2, ...props }, ref) {
      const elementPropsWithoutClassNameAndClassifierKeys = omit(props, [
        "className",
        ...maybeClassifier ? Object.keys(maybeClassifier) : []
      ]);
      const mergedProps = {
        ...mergeClassNamesIntoProps(
          elementPropsWithoutClassNameAndClassifierKeys,
          classify(props),
          // Apply default classes first
          className2
          // Append className from props last to override
        ),
        ref
        // Attach the forwarded ref here
      };
      switch (jsxElem.type) {
        case "function-component": {
          const FunctionComponent = jsxElem.fn;
          return /* @__PURE__ */ jsx(FunctionComponent, { ...mergedProps });
        }
        case "tag-name": {
          const Tag = jsxElem.tag;
          return /* @__PURE__ */ jsx(Tag, { ...mergedProps });
        }
      }
    }
  );
}
export {
  twux,
  twMerge2 as tx
};
//# sourceMappingURL=index.mjs.map