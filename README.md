# Tailwind User Experience

Twux is a simple and powerful way to build re-usable type-safe React components
with Tailwind in a 2.5 KB library.

```tsx
const MyButton = twux("text-white bg-blue-500", "button");
```

It supports variants...

```tsx
const MyButton = twux(
  "text-white",
  {
    style: {
      primary: "bg-blue-500",
      danger: "bg-red-500",
    },
  },
  "button"
);
```

And function components...

```tsx
const MySaveButton = twux("text-white bg-blue-500", (props) => {
  return (
    <button {...props} type="submit">
      Save
    </button>
  );
});
```

And is easy to compose into mini libraries...

```tsx
const MyForm = {
  Button: twux("text-white bg-blue-500", "button"),
  Input: twux("border text-sm", "input"),
  Group: twux("p-4", "div"),
};
```

Automatically handles

- Tailwind `className` merging with `tailwind-merge`
- Adding `forwardRef` to components

Everything is TypeScript first

- Creates HTML based components with typed `props` based on the tag name like `button` so you don't have to remember to type `(props: React.ButtonHTMLAttributes<HTMLButtonElemeent>)`
- Extracts and uses typed `props` from Function Components

## Getting started

Add `twux` to your project

```bash
# npm
npm install twux

# yarn
yarn add twux

# pnpm
pnpm add twux
```

## Basic Usage

Starting is as simple as

```tsx
import { twux } from "twux";

const MyButton = twux("text-white bg-blue-500", "button");

function Component() {
  return <MyButton>Click me</MyButton>;
}
```

The first argument to `twux` is the `className` which is added to the component.

The last argument is the `tagName` of a valid HTML element.

`MyButton` is properly typed to have the props from a `button` element based on the `tagName`.

The `MyButton` component can take its own `className` and conflicting Tailwind classes will be automatically removed.

```tsx
function Component() {
  return <MyButton className="bg-red-500">Delete me</MyButton>;
  // `bg-red-500` removes `bg-blue-500`
}
```

## Variants

Add style variants by adding an Object as the second argument.

```tsx
const MyButton = twux(
  "text-white",
  {
    style: {
      primary: "bg-blue-500",
      danger: "bg-red-500",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  "button"
);
```

Now you can use it like this

```tsx
function Form() {
  return (
    <div>
      <MyButton style="primary" size="md">
        Save
      </MyButton>
      <MyButton style="danger" size="md">
        Delete
      </MyButton>
    </div>
  );
}
```

Twux has strict type safety

```tsx
function Form() {
  return (
    <div>
      {/* This is a type error because the style prop is missing */}
      <MyButton size="md">This button is missing a style prop</MyButton>
    </div>
  );
}
```

If you don't want to require a variant prop, add defaults...

## Variants with Defaults

Add a third Object in the third argument to specify default values.

```tsx
const MyButton = twux(
  "text-white",
  {
    style: {
      primary: "bg-blue-500",
      danger: "bg-red-500",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  {
    style: "primary",
    size: "md",
  },
  "button"
);
```

## Variants with Boolean Props

Sometimes you want the variants to toggle a className on. In that case, use a `string` as the value.

```tsx
const MyParagraph = twux(
  "text-black",
  {
    dazzle: "text-xl bold italic",
  },
  "p"
);
```

Which you can use like a flag.

```tsx
function Form() {
  return <MyParagraph dazzle>Dazzling paragraph!</MyParagraph>;
}
```

You can default boolean props to be on by using a `true` value in the third
argument which is used for defaults.

```tsx
const MyParagraph = twux(
  "text-black",
  {
    dazzle: "text-xl bold italic",
  },
  {
    dazzle: true,
  },
  "p"
);
```

## Function Component

Sometimes you need more customization than an HTML element like a "button" or "div".

provide a function is the final argument to `twux`.

```tsx
const HelloButton = twux(
  "text-white bg-blue-500",
  ({ className, name }: { className: string; name: string }) => {
    return <button className={className}>Hello {name}</button>;
  }
);

function Form() {
  return <HelloButton name="John Doe" />;
}
```

`HelloButton` is typed to accept the props from the function component
passed to `twux`.

## Function Component with Element Props

One weakness of adopting the props from the function component is that we the built in props on an Element.

`twux` provides a built-in type helper to get those types back.

```tsx
import { type ElementProps, twux } from "twux";

const HelloButton = twux(
  "text-white bg-blue-500",
  ({ name, ...props }: ElementProps<"button"> & { name: string }) => {
    return <button {...props}>Hello {name}</button>;
  }
);

function Form() {
  return <HelloButton name="John Doe" disabled />;
}
```

The `ElementProps` generic type returns all the props for a "button" in the example above.

In the example, we then add the `{ name: string }` that's custom for this function component.

The `{ name, ...props }` takes the `name` out from the rest of the props. The `props` are fed into `<button {...props}>`.

## Incremental Adoption

The Twux library is designed to start simple and add features only when necessary by allowing you to add them to the arguments.

There are only two required arguments.

```tsx
const Button = twux("text-white bg-blue-500", "button");
```

At some point, we may want to add variant flags to turn some classNames on

```tsx
const Button = twux("bg-blue-500", { danger: "bg-red-500" }, "button");
```

Then possibly add more complex variants with options and default values...

```tsx
const MyButton = twux(
  "text-white",
  {
    style: {
      primary: "bg-blue-500",
      danger: "bg-red-500",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  {
    style: "primary",
    size: "md",
  },
  "button"
);
```

And at some, you may need function components if HTML elements aren't enough...

```tsx
const HelloButton = twux(
  "text-white bg-blue-500",
  ({ className, name }: { className: string; name: string }) => {
    return <button className={className}>Hello {name}</button>;
  }
);
```

As your needs grow, twux components are easy to put into libraries using plain JavaScript/TypeScript.

```tsx
const MyLib = {
  Button: twux('text-white bg-blue-500', 'button'),
  Input: twux('border', 'input)
}
```
