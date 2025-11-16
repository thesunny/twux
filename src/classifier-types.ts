/**
 * A classifier value can be
 *
 * - `string` which indicates that the user can pass a boolean prop
 * - `object` which indicates that the user can pass a string prop keyed by the
 *   object keys
 */
type ClassifierValueBaseType = string | Record<string, string>;

type ConvertClassifierValueToPropValue<
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
