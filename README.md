# Tailwind User Experience

Twux is a simple and powerful way to build re-usable type-safe React components
with Tailwind in a 2.5 KB library.

See the [Twux Documentation and Website](https://twux.vercel.app/) to learn more.

## Basic Usage

```tsx
import { twux } from "twux";

const Button = twux("text-white bg-blue-500", "button");
```

Example 1:

```tsx
<Button>
  Click me!
</Button>

// Outputs

<button className="text-white bg-blue-500">
  Click me!
</button>
```

Example 2:

```tsx
<Button className="bg-red-500">
  Click me!
</Button>

// Outputs

<button className="text-white bg-red-500">
  Click me!
</button>
```


## Variants

Twux supports variants of components by providing an `object` as the second argument.

```tsx
const VariantButton = twux(
  "text-white p-2 rounded",
  {
    // color variant with two options
    color: {
      primary: "bg-blue-500",
      gray: "bg-gray-500",
    },
    // size variant with three options
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  "button"
);
```

Example 1:

```tsx
<VariantButton color="primary" size="md">
  Medium Primary Button
</VariantButton>

// Outputs

<button className="bg-blue-500 text-base">
  Medium Primary Button
</button>
```

Example 2:

```tsx
<VariantButton color="gray" size="sm">
  Small Gray Button
</VariantButton>

// Outputs

<button className="bg-gray-500 text-sm">
  Small Gray Button
</button>
```

Twux also support [default values for variants](https://twux.vercel.app/variants#default-values).

## Boolean Variants

Twux also supports boolean variants by providing a `string` value for each variant instead of an `object`.

```tsx
const BooleanButton = twux(
  "text-white p-2 rounded bg-blue-500",
  {
    bold: "font-bold",
    italic: "italic",
  },
  "button"
);
```

Example 1:

```tsx
<BooleanButton bold>
  Bold Button
</BooleanButton>

// Outputs

<button className="font-bold">
  Bold Button
</button>
```

Example 2:

```tsx
<BooleanButton italic>
  Italic Button
</BooleanButton>

// Outputs

<button className="italic">
  Bold Button
</button>
```

Note: Boolean variants and option variants can be mixed and matched.

## Function Components

Twux can be used with function components by passing a function as the final argument.

```tsx
import { twux } from "twux";
 
const Chip = twux(
  "text-xs bg-orange-600 text-white rounded-full px-2 py-1 inline-block",
  ({ className, text }: { className: string; text: string }) => {
    return <span className={className}>{text}</span>;
  }
);
```

Example:

```tsx
<Chip text="This is a chip" />

// Outputs

<span className="text-xs bg-orange-600 text-white rounded-full px-2 py-1 inline-block">
  This is a chip
</span>
```


## Documentation

[Read the Twux documentation](https://twux.vercel.app/) to learn more about

- [Geting Started](https://twux.vercel.app/getting-started)
- [Default Values](https://twux.vercel.app/variants#default-values)
- [Building Libraries](https://twux.vercel.app/libraries)
- [Frequently Asked Questions](https://twux.vercel.app/faq)