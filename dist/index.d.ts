import React, { JSX } from 'react';
export { twMerge as tx } from 'tailwind-merge';

/**
 * A classifier value can be
 *
 * - `string` which indicates that the user can pass a boolean prop
 * - `object` which indicates that the user can pass a string prop keyed by the
 *   object keys
 */
type ClassifierValueBaseType = string | Record<string, string>;
type ConvertClassifierValueToPropValue<T extends string | Record<string, string>> = T extends string | {
    true: string;
} | {
    false: string;
} | {
    true: string;
    false: string;
} ? /**
   * If the value is a string or an object with a `true` or `false` key, the
   * prop is an optional boolean which is specified as `boolean | undefined`
   * which is later turned into an optional boolean when converted to an
   * object property.
   */ boolean | undefined : T extends Record<infer K, string> ? K : never;
type MakeUndefinedOptional<T> = {
    [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
} & {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};
type ConvertClassifierToProps<T extends Record<string, ClassifierValueBaseType>> = MakeUndefinedOptional<{
    [K in keyof T]: ConvertClassifierValueToPropValue<T[K]>;
}>;

type ElementProps<N extends React.ElementType | React.FC> = React.ComponentPropsWithoutRef<N>;
type HTMLElementProps<N extends React.ElementType | React.FC> = React.ComponentPropsWithoutRef<N>;
type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type BaseClassifier = Record<string, Record<string, string> | string>;
/**
 * className and tagName
 */
declare function twux<K extends keyof JSX.IntrinsicElements>(className: string, Tag: K): React.FC<JSX.IntrinsicElements[K]>;
/**
 * className and Function Component
 */
declare function twux<FCProps extends Record<string, unknown>>(className: string, Component: React.FC<FCProps>): React.FC<FCProps>;
/**
 * className, classifier object and tagName
 */
declare function twux<K extends keyof JSX.IntrinsicElements, C extends BaseClassifier>(className: string, classifier: C, Tag: K): React.FC<JSX.IntrinsicElements[K] & ConvertClassifierToProps<C>>;
/**
 * className, classifier object and Function Component
 */
declare function twux<FCProps extends Record<string, unknown>, C extends BaseClassifier>(className: string, classifier: C, Tag: React.FC<FCProps>): React.FC<FCProps & ConvertClassifierToProps<C>>;
/**
 * className, classifier object, default values and tagName
 */
declare function twux<K extends keyof JSX.IntrinsicElements, C extends BaseClassifier, D extends Partial<ConvertClassifierToProps<C>>>(className: string, classifier: C, defaultValues: D, Tag: K): React.FC<JSX.IntrinsicElements[K] & 
/**
 * If defaultValues are provided, we need to make the provided defaultValues
 * optional
 */
MakeOptional<ConvertClassifierToProps<C>, 
/**
 * we need to do this because TypeScript can't figure out that keyof D
 * satisfies the constraint of keyof ConvertClassifierToProps<C>
 */
keyof ConvertClassifierToProps<C> & keyof D>>;
/**
 * className, classifier object, default values and FunctionComponent
 */
declare function twux<FCProps extends Record<string, unknown>, C extends BaseClassifier, D extends Partial<ConvertClassifierToProps<C>>>(className: string, classifier: C, defaultValues: D, Tag: React.FC<FCProps>): React.FC<FCProps & 
/**
 * If defaultValues are provided, we need to make the provided defaultValues
 * optional
 */
MakeOptional<ConvertClassifierToProps<C>, 
/**
 * we need to do this because TypeScript can't figure out that keyof D
 * satisfies the constraint of keyof ConvertClassifierToProps<C>
 */
keyof ConvertClassifierToProps<C> & keyof D>>;

export { type ElementProps, type HTMLElementProps, twux };
