// import { type ClassValue, clsx } from "clsx";
import React, { forwardRef, type JSX } from "react";
import { twMerge } from "tailwind-merge";
import { isRecord, isString, isFunction, omit } from "./utils";

export type ElementProps<N extends React.ElementType | React.FC> =
  React.ComponentPropsWithoutRef<N>;

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * tx is a convenience export of tailwind-merge with a similar syntax to `cx` or
 * `clsx`. We don't use `twMerge` to avoid possible conflicts.
 */
export const tx = twMerge;

type JsxElement =
  | {
      type: "tag";
      tag: keyof JSX.IntrinsicElements;
    }
  | {
      type: "fn";
      fn: React.FC;
    }
  | {
      type: "undefined";
    };

/**
 * Takes as it's first argument, a set of `props` from an element or function
 * component. We then merge the arguments which are class names into the
 * `className` of the `props` using `twMerge`.
 *
 * The className that is actually on the props takes precedence over the class
 * names that are passed in.
 */
export function mergeClassNamesIntoProps<T extends { className?: string }>(
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
export function twux<FCP extends Record<string, unknown>>(
  className: string,
  Component: React.FC<FCP>
): React.FC<FCP>;
/**
 * className, classifier object and tagName
 */
export function twux<
  K extends keyof JSX.IntrinsicElements,
  C extends Record<string, string | Record<string, string>>
>(
  className: string,
  classifier: C,
  Tag: K
): React.FC<JSX.IntrinsicElements[K] & ConvertClassifierToProps<C>>;
/**
 * className, classifier object and Function Component
 */
export function twux<
  FCP extends Record<string, unknown>,
  C extends Record<string, string | Record<string, string>>
>(
  className: string,
  classifier: C,
  Tag: React.FC<FCP>
): React.FC<FCP & ConvertClassifierToProps<C>>;
/**
 * className, classifier object, default values and tagName
 */
export function twux<
  K extends keyof JSX.IntrinsicElements,
  C extends Record<string, string | Record<string, string>>,
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
  FCP extends Record<string, unknown>,
  C extends Record<string, string | Record<string, string>>,
  D extends Partial<ConvertClassifierToProps<C>>
>(
  className: string,
  classifier: C,
  defaultValues: D,
  Tag: React.FC<FCP>
): React.FC<
  FCP &
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
 * The arguments for telem are as follows:
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
export function twux<
  K extends keyof JSX.IntrinsicElements,
  FCProps extends Record<string, unknown>,
  C extends Record<string, string | Record<string, string>>
>(
  className: string,
  arg2:
    | K
    | React.FC<FCProps>
    // optional classifier
    | C,
  arg3?:
    | K
    | React.FC<FCProps>
    // optional default values
    | Partial<ConvertClassifierToProps<C>>,
  arg4?: K | React.FC<FCProps>
): React.FC {
  const classifier = isRecord(arg2) ? arg2 : undefined;
  const defaultValues =
    classifier && isRecord(arg3)
      ? arg3
      : ({} as Partial<ConvertClassifierToProps<C>>);

  function classify(props: Record<string, unknown>): string[] {
    const classes: string[] = [className];
    if (!classifier) return classes;
    Object.entries(classifier).forEach(([key, value]) => {
      if (isString(value)) {
        /**
         * If the use passed in a prop that matches the key, then add the
         * value to the classes array if that prop's value is truthy.
         * Otherwise check if the defaultValues for the key is truthy and if
         * so push the value to the classes array.
         */
        if (
          key in props
            ? props[key]
            : (defaultValues as Record<string, true>)[key]
        ) {
          classes.push(value);
          return;
        }
      } else if (isRecord(value)) {
        Object.entries(value).forEach(([k, v]) => {
          if (
            key in props
              ? props[key] === k
              : (defaultValues as Record<string, string>)[key] === k
          ) {
            classes.push(v);
          }
        });
      }
    });
    return classes;
  }

  // type Jsx

  const tagName = isString(arg2)
    ? arg2
    : isString(arg3)
    ? arg3
    : isString(arg4)
    ? arg4
    : undefined;
  const functionComponent = isFunction(arg2)
    ? arg2
    : isFunction(arg3)
    ? arg3
    : isFunction(arg4)
    ? arg4
    : undefined;
  const jsxElem: JsxElement = tagName
    ? { type: "tag", tag: tagName }
    : functionComponent
    ? ({ type: "fn", fn: functionComponent } as { type: "fn"; fn: React.FC })
    : ({ type: "undefined" } as { type: "undefined" });
  if (jsxElem.type === "undefined") {
    throw new Error(
      "You must provide either a JSX tag (string) or a function component (function) as argument 2, 3, or 4"
    );
  }

  /**
   * We specify the `props` as `className?: string` and ignoring the other
   * props. This is not technically correct, but it satisfies the `className`
   * type and we are doing the more strict checks in the overrides above.
   *
   * returns a forwardRef component
   */
  return forwardRef<React.ComponentRef<K>, { className?: string }>(
    function __twux_component__({ className, ...props }, ref): JSX.Element {
      /**
       * We use `any` here. Should be safe because we are removing the keys
       * from `classifier` and the `classifier` are all props that are used
       * for processing the classifier. These should NOT be included in the
       * elementProps.
       */
      const elementProps = classifier
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          omit(props, Object.keys(classifier) as any)
        : props;

      // Merge props with default class names
      const mergedProps = {
        ...mergeClassNamesIntoProps(
          elementProps as { className?: string; [key: string]: unknown },
          //  JSX.IntrinsicElements[K], // Spread the rest of the props
          classify(props), // Apply default classes first
          className // Append className from props last
        ),
        ref, // Attach the forwarded ref here
      } as JSX.IntrinsicElements[K] & {
        ref?: React.Ref<JSX.IntrinsicElements[K]>;
      };

      switch (jsxElem.type) {
        case "fn": {
          const FunctionComponent = jsxElem.fn;
          return <FunctionComponent {...mergedProps} />;
        }
        case "tag": {
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

export type ClassifierValueBaseType = string | Record<string, string>;

export type ConvertClassifierValueToPropValue<
  T extends string | Record<string, string>
> = T extends
  | string
  | { true: string }
  | { false: string }
  | { true: string; false: string }
  ? /**
     * If the value is a string or an object with a `true` or `false` key, the
     * prop is an optional boolean which is specified as `boolean | undefined`
     * which is later turned into an optional boolean when converted to an
     * object property.
     */
    boolean | undefined
  : T extends Record<infer K, string>
  ? /**
     * If the value is an object with string keys, then the acceptable values
     * for the prop are the keys of the object.
     */
    K
  : never;

type MakeUndefinedOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export type ConvertClassifierToProps<
  T extends Record<string, ClassifierValueBaseType>
> = MakeUndefinedOptional<{
  [K in keyof T]: ConvertClassifierValueToPropValue<T[K]>;
}>;
