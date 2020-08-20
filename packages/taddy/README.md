<p align="center">
    <img src="https://github.com/lttb/taddy/blob/main/docs/logo/taddy1.png?raw=true" alt="taddy" width="300">
</p>

<h1 align="center">
    taddy
</h1>

<h3 align="center">
    Compile-time Atomic CSS-in-JS
</h3>

<p align="center">
    <a href="https://www.npmjs.com/package/taddy">
        <img alt="taddy npm" src="https://img.shields.io/npm/v/taddy">
    </a>
    <a href="https://bundlephobia.com/result?p=@taddy/core">
        <img alt="@taddy/core npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@taddy/core?label=%40taddy%2Fcore%20mingzip&logo=%40taddy%2Fcore">
    </a>
    <a href="https://bundlephobia.com/result?p=taddy">
        <img alt="taddy npm bundle size" src="https://img.shields.io/bundlephobia/minzip/taddy?label=taddy%20mingzip&logo=%40taddy%2Fcore">
    </a>
   
</p>

<!-- markdownlint-disable MD041 -->

## Quick Start

```sh
npm install --save taddy
```

<!-- prettier-ignore -->
```jsx
import React from 'react'

import {css} from 'taddy'

export function Title() {
    return (
        <h1 {...css({color: 'blueviolet'})}>
            Hello, taddy!
        </h1>
    )
}
```

## Usage

### css

There is an agnostic `css` function, that returns an object of `className` and `style`.

That's a framework-agnostic function, so it's ready for the usage at any environment.

```js
// button = {className: 'hash1 hash2', style: {}}
const button = css({padding: '10px', border: 'none'});
```

#### pseudo classes

```js
const button = css({
    padding: '10px',
    border: 'none',
    color: 'red',

    ':hover': {
        color: 'blue',
    },
});
```

### css.mixin

In terms of `taddy`, mixin is a special styling object, that can be used as a part of styles by `css`.

To declare the mixin styles, there is a special function `css.mixin`:

```js
const heading = css.mixin({
    fontSize: '20px',
    fontWeight: 'bold',
});
```

`mixin` also could be used as a named export:

```js
import {mixin} from 'taddy';

const heading = mixin({
    fontSize: '20px',
    fontWeight: 'bold',
});
```

#### merge

Mixin can be applied by spreading to the styles, consumed by `css`:

```js
const heading = css.mixin({
    fontSize: '20px',
    fontWeight: 'bold',
});

const Title = ({children}) => (
    <h1 {...css({...heading, color: 'crimson'})}>{children}</h1>
);
```

Mixins also could be used on the nested level:

```js
const halfTransparent = css.mixin({
    opacity: 0.5,
});

const Title = ({children}) => (
    <h1
        {...css({
            color: 'crimson',

            ':hover': halfTransparent,
        })}
    >
        {children}
    </h1>
);
```

#### composes

Mixins are cool, but they have some restrictions.

For example, let's consider two mixins:

```js
const colorStateful = css.mixin({
    color: 'red',

    ':hover': {
        color: 'blue',
    },
});

const opacityStateful = css.mixin({
    opacity: 1,

    ':hover': {
        opacity: 0.5,
    },
});
```

In terms of merge, the result of `css({...colorStateful, ...opacityStateful})` would be `{color: 'red', opacity: 1, ':hover': {opacity: 0.5}}`

But what if we want to apply both mixins together?

There is `composes` option for that:

```js
const Title = ({children}) => (
    <h1
        {...css({
            textDecoration: 'underline',
            composes: [colorStateful, opacityStateful],
        })}
    >
        {children}
    </h1>
);
```

> `composes` could be used **only** on the top level of styles declaration
