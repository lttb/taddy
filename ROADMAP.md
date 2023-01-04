# Roadmap

The list of key ideas and features that would be great to implement to improve the overall usage experience.

Please fill free to share any your idea and [add your proposal](https://github.com/lttb/taddy/issues/new?labels=enhancement&title=[dx]%20my%20proposal) to help `taddy` become better.

## Overall

-   [ ] Support `styled` function for components, by `@taddy/styled` (?)
-   [ ] Provide tools and adaptors for easier `taddy` adoption
-   [ ] support `keyframes` and `media`
-   [ ] support global styles (?)

## Runtime

-   [ ] support runtime vendor prefixes
-   [ ] optimize `class` atomic merge (?)
-   [ ] improve the detection of styles that were already declared

## Compiler

-   [ ] Optimize `babel-plugin`:
    -   [ ] Improve the way plugin schedules the persistent cache updates
    -   [ ] Research the ways to make the pre-evaluation more efficient
-   [ ] Support `taddy.config.ts`
-   [ ] Support atoms pregeneration based on the `config`
-   [ ] Support theming (?)
-   [ ] Improve `typescript` usage:
    -   [ ] improve dynamic types infer
    -   [ ] improve types usage for the complex pre-evaluation (e.g. calculate all the combinations of the calculation based on dynamic typed values)
    -   [ ] make it stable
-   [ ] Optional bindings optimization (?) (at the moment that's always enabled)
-   [ ] Support `tagged template literals` by default (at the moment, it's under the unstable flag)
-   [ ] Optional `taddy/css` auto-import
-   [ ] Support custom paths in `taddy/css`

## Developer Experience

-   [ ] Check the usage of `taddy/css` and report if styles were not included to the app
-   [ ] Provide better compiler errors and tips
    -   For example, show errors on `&` usage in selectors
-   [ ] Serialize `class` values as readable names instead of the hashes for the `DEV` mode
-   [ ] Provide optional warnings, errors and tips if compiler can't statically extract the css code
-   [ ] Provide `css source maps` for the declared css-in-js styles

## Documentation

-   [ ] Describe the tradeoffs and edge cases
-   [ ] Provide different examples and tips for different environments (CRA, next.js, Svelte etc.)
