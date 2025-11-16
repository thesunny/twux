// import { type ClassValue, clsx } from "clsx";
import React, { forwardRef, type JSX } from "react";
import { twMerge } from "tailwind-merge";
import { isRecord, isString, isFunction, omit } from "./utils";
import { ConvertClassifierToProps } from "./classifier-types";

/**
 * tx is a convenience export of tailwind-merge with a similar syntax to `cx` or
 * `clsx`. We don't use `twMerge` to avoid possible conflicts.
 */
export { twMerge as tx } from "tailwind-merge";

export type ElementProps<N extends React.ElementType | React.FC> =
  React.ComponentPropsWithoutRef<N>;

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type JsxElementTagName = { type: "tag-name"; tag: keyof JSX.IntrinsicElements };
type JsxElementFunctionComponent = { type: "function-component"; fn: React.FC };
type JsxElement = JsxElementTagName | JsxElementFunctionComponent;

/**
 * Takes the arguments after the first in twux and returns a JsxElement.
 *
 * The return value is a JsxElement.
 */
function getJsxElementFromArgs(
  ...args: (
    | keyof JSX.IntrinsicElements
    | React.FC
    | Record<string, unknown> // could be a classifier object
    | undefined
  )[]
): JsxElement {
  for (const arg of args) {
    if (isString(arg)) return { type: "tag-name", tag: arg };
    if (isFunction(arg)) return { type: "function-component", fn: arg };
  }
  throw new Error(
    "You must provide either a JSX tag (string) or a function component (function) as argument 2, 3, or 4"
  );
}

type BaseClassifier = Record<string, Record<string, string> | string>;

/**
 * Takes as it's first argument, a set of `props` from an element or function
 * component. We then merge the arguments which are class names into the
 * `className` of the `props` using `twMerge`.
 *
 * The className that is actually on the props takes precedence over the class
 * names that are passed in.
 */
function mergeClassNamesIntoProps<T extends { className?: string }>(
  { className, ...props }: T,
  ...classes: Parameters<typeof twMerge>
): Omit<T, "className"> & { className: string } {
  const nextClassName = twMerge(...classes, className);
  return { ...props, className: nextClassName };
}

/**
 * className and tagName
 */
export function twux<K extends keyof JSX.IntrinsicElements>(
  className: string,
  Tag: K
): React.FC<JSX.IntrinsicElements[K]>;
/**
 * className and Function Component
 */
export function twux<FCProps extends Record<string, unknown>>(
  className: string,
  Component: React.FC<FCProps>
): React.FC<FCProps>;
/**
 * className, classifier object and tagName
 */
export function twux<
  K extends keyof JSX.IntrinsicElements,
  C extends BaseClassifier
>(
  className: string,
  classifier: C,
  Tag: K
): React.FC<JSX.IntrinsicElements[K] & ConvertClassifierToProps<C>>;
/**
 * className, classifier object and Function Component
 */
export function twux<
  FCProps extends Record<string, unknown>,
  C extends BaseClassifier
>(
  className: string,
  classifier: C,
  Tag: React.FC<FCProps>
): React.FC<FCProps & ConvertClassifierToProps<C>>;
/**
 * className, classifier object, default values and tagName
 */
export function twux<
  K extends keyof JSX.IntrinsicElements,
  C extends BaseClassifier,
  D extends Partial<ConvertClassifierToProps<C>>
>(
  className: string,
  classifier: C,
  defaultValues: D,
  Tag: K
): React.FC<
  JSX.IntrinsicElements[K] &
    /**
     * If defaultValues are provided, we need to make the provided defaultValues
     * optional
     */
    MakeOptional<
      ConvertClassifierToProps<C>,
      /**
       * we need to do this because TypeScript can't figure out that keyof D
       * satisfies the constraint of keyof ConvertClassifierToProps<C>
       */
      keyof ConvertClassifierToProps<C> & keyof D
    >
>;
/**
 * className, classifier object, default values and FunctionComponent
 */
export function twux<
  FCProps extends Record<string, unknown>,
  C extends BaseClassifier,
  D extends Partial<ConvertClassifierToProps<C>>
>(
  className: string,
  classifier: C,
  defaultValues: D,
  Tag: React.FC<FCProps>
): React.FC<
  FCProps &
    /**
     * If defaultValues are provided, we need to make the provided defaultValues
     * optional
     */
    MakeOptional<
      ConvertClassifierToProps<C>,
      /**
       * we need to do this because TypeScript can't figure out that keyof D
       * satisfies the constraint of keyof ConvertClassifierToProps<C>
       */
      keyof ConvertClassifierToProps<C> & keyof D
    >
>;
/**
 * The arguments for twux are as follows:
 *
 * - className: This is always required
 * - classifier?: An optional object that represents variants of the JSX Element
 *   or Function Component.
 * - defaultValues?: An optional object that represents the default values for
 *   the classifier. Note that the default values cannot be provided without the
 *   classifier first being provided.
 * - Tag (string) | FunctionComponent (React.FC): This is the JSX element or Function Component that
 *   will be rendered.
 *
 * The return value is a new function component that can be used to render the
 * element or function component. It provides the `className` which is added.
 *
 * The combinations of arguments are:
 * - className, Tag | Function Component
 * - className, classifier, Tag | Function Component
 * - className, classifier, defaultClassifierValues, Tag | Function Component
 *
 */
export function twux<TagName extends keyof JSX.IntrinsicElements>(
  className: string,
  arg2: TagName | React.FC | BaseClassifier,
  arg3?: TagName | React.FC | Partial<ConvertClassifierToProps<BaseClassifier>>,
  arg4?: TagName | React.FC
): React.FC {
  const maybeClassifier = isRecord(arg2) ? arg2 : undefined;
  const maybeDefaultValues =
    maybeClassifier && isRecord(arg3)
      ? arg3
      : ({} as Partial<ConvertClassifierToProps<BaseClassifier>>);

  function classify(incomingProps: Record<string, unknown>): string[] {
    const classNames: string[] = [className];
    if (!maybeClassifier) return classNames;
    for (const [key, value] of Object.entries(maybeClassifier)) {
      if (isString(value)) {
        /**
         * If the use passed in a prop that matches the key, then add the
         * value to the classes array if that prop's value is truthy.
         * Otherwise check if the defaultValues for the key is truthy and if
         * so push the value to the classes array.
         */
        if (
          key in incomingProps ? incomingProps[key] : maybeDefaultValues[key]
        ) {
          classNames.push(value);
        }
        continue;
      }
      if (isRecord(value)) {
        Object.entries(value).forEach(([k, v]) => {
          if (
            key in incomingProps
              ? incomingProps[key] === k
              : maybeDefaultValues[key] === k
          ) {
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

  // type Jsx

  const jsxElem = getJsxElementFromArgs(arg2, arg3, arg4);

  /**
   * We specify the `props` as `className?: string` and ignoring the other
   * props. This is not technically correct, but it satisfies the `className`
   * type and we are doing the more strict checks in the overrides above.
   *
   * returns a forwardRef component
   */
  return forwardRef<React.ComponentRef<TagName>, { className?: string }>(
    function __twux_component__({ className, ...props }, ref): JSX.Element {
      const elementPropsWithoutClassNameAndClassifierKeys = omit(props, [
        "className",
        ...(maybeClassifier ? Object.keys(maybeClassifier) : []),
      ]);

      // Merge props with default class names
      const mergedProps = {
        ...mergeClassNamesIntoProps(
          elementPropsWithoutClassNameAndClassifierKeys,
          classify(props), // Apply default classes first
          className // Append className from props last to override
        ),
        ref, // Attach the forwarded ref here
      } as JSX.IntrinsicElements[TagName] & {
        ref?: React.Ref<JSX.IntrinsicElements[TagName]>;
      };

      switch (jsxElem.type) {
        case "function-component": {
          const FunctionComponent = jsxElem.fn;
          return <FunctionComponent {...mergedProps} />;
        }
        case "tag-name": {
          /**
           * We need to type cast `jsxElem.tag` to `React.ElementType` because
           * `jsxElem.tag` can be an SVG type and that causes type issues. There
           * is no easy to way to filter out the SVG types without doing it
           * manually.
           */
          const Tag = jsxElem.tag as React.ElementType;
          return <Tag {...mergedProps} />;
        }
      }
    }
  );
}
