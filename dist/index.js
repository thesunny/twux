"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  twux: () => twux,
  tx: () => import_tailwind_merge2.twMerge
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_tailwind_merge = require("tailwind-merge");

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
var import_tailwind_merge2 = require("tailwind-merge");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const nextClassName = (0, import_tailwind_merge.twMerge)(...classes, className);
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
  return (0, import_react.forwardRef)(
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
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunctionComponent, { ...mergedProps });
        }
        case "tag-name": {
          const Tag = jsxElem.tag;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { ...mergedProps });
        }
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  twux,
  tx
});
//# sourceMappingURL=index.js.map