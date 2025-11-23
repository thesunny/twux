# Tailwind User Experience

Twux is a simple and powerful way to build re-usable type-safe React components
with Tailwind in a 2.5 KB library.

See the [Twux Documentation and Website](https://twux.vercel.app/) to learn more.

## Basic Usage

```tsx
const Button = twux("text-white bg-blue-500", "button");
```

Examples:

<table style="width: 100%;">
<thead>
<tr>
<th style="width: 50%;">Usage</th>
<th style="width: 50%;">Generates</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
<Button>
  Click me!
</Button>
```

</td>
<td>

```tsx
<button className="text-white bg-blue-500">
  Click me!
</button>
```

</td>
</tr>

<tr>
<td>

```tsx
<Button className="bg-red-500">
  Click me!
</Button>
```

</td>
<td>

```tsx
<button className="text-white bg-red-500">
  Click me!
</button>
```

</td>
</tr>

</tbody>
</table>

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

Examples:

<table style="width: 100%;">
<thead>
<tr>
<th style="50%;">Usage</th>
<th style="50%;">Generates</th>
</tr>
</hthead>
<tbody>

<tr>
<td>

```tsx
<VariantButton color="primary" size="md">
  Medium Primary Button
</VariantButton>
```

</td>
<td>

```tsx
<button className="bg-blue-500 text-base">
  Medium Primary Button
</button>
```

</td>
</tr>

<tr>
<td>

```tsx
<VariantButton color="gray" size="sm">
  Small Gray Button
</VariantButton>
```

</td>
<td>

```tsx
<button className="bg-gray-500 text-sm">
  Small Gray Button
</button>
```

</td>
</tr>

</tbody>
</table>

Twux also support [default values for variants](#use-content-default-values).

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

Examples:

<table style="width: 100%;">
<thead>
<tr>
<th style="width: 50%;">Usage</th>
<th style="width: 50%;">Generates</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
<BooleanButton bold>
  Bold Button
</BooleanButton>
```

</td>
<td>


```tsx
<button className="font-bold">
  Bold Button
</button>
```

</td>
</tr>
<tr>
<td>

```tsx
<BooleanButton italic>
  Italic Button
</BooleanButton>
```

</td>
<td>

```tsx
<button className="italic">
  Bold Button
</button>
```

</td>
</tr>
</tbody>
</table>

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

Examples:

