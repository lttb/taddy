# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.1.0-alpha.4](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.1.0-alpha.3...@taddy/babel-plugin@0.1.0-alpha.4) (2023-04-29)

### Bug Fixes

- **babel-plugin:** fix colon prefix duplication ([2114bd2](https://github.com/lttb/taddy/commit/2114bd23bf8654c6eff6278a13cda490b58b8fb8))
- **babel-plugin:** handle static classNames on evaluation ([32d29ad](https://github.com/lttb/taddy/commit/32d29adcfca5e629381f705e06ec8f756943333c))
- **babel-plugin:** set config target back after compilation in worker ([88c167c](https://github.com/lttb/taddy/commit/88c167cc740e5b87d5aeed5a2a5e25823866838d))

### Features

- **babel-plugin:** don't compile node_modules ([d832735](https://github.com/lttb/taddy/commit/d832735f58a70b8cd65cdb3cb8763a30bf61569a))
- **babel-plugin:** transpile modules on eval ([8ce93ed](https://github.com/lttb/taddy/commit/8ce93ed5ea6c6a269d583325cdf3ebaa9891737f))
- **taddy:** add "\_" class to maintain specificity ([a5ffa60](https://github.com/lttb/taddy/commit/a5ffa60bd9d8fef4dbb707211afc25df34737d86))

# [0.1.0-alpha.3](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.1.0-alpha.2...@taddy/babel-plugin@0.1.0-alpha.3) (2023-04-14)

### Features

- **babel-plugin:** restore cached content per file in output ([c668bf5](https://github.com/lttb/taddy/commit/c668bf5c52b6ca9d94b4fa6b11053851930ea8ed))

# [0.1.0-alpha.2](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.1.0-alpha.1...@taddy/babel-plugin@0.1.0-alpha.2) (2023-04-05)

### Features

- **babel-plugin:** change output file cache directory ([9867716](https://github.com/lttb/taddy/commit/9867716570c8ce8524bbb530cf8ab4d6d9ce028e))
- **babel-plugin:** switch transfrom to sync version ([225dd1c](https://github.com/lttb/taddy/commit/225dd1c5593685af9b77f66ec0c939f62d8429dc))
- **babel-plugin:** update output implementation ([9eeeea4](https://github.com/lttb/taddy/commit/9eeeea4e861207b25ecdab4c4d34075d0b0c895f))
- **babel-plugin:** use find-cache-dir ([b37c6bf](https://github.com/lttb/taddy/commit/b37c6bf46b68c4432173618469bcd0a5c93ab60c))

# [0.1.0-alpha.1](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.1.0-alpha.0...@taddy/babel-plugin@0.1.0-alpha.1) (2023-03-19)

### Bug Fixes

- **babel-plugin, taddy:** fix at rules compilation ([1d904da](https://github.com/lttb/taddy/commit/1d904da4c069824696afd14fb2399dded3990c6e))
- **babel-plugin:** fix objects merge for spreads and recursive traverse ([9b40698](https://github.com/lttb/taddy/commit/9b40698cdaab2952fa1a908257673dcbc7ec89b5))

### Features

- **babel-plugin, taddy:** support at rules compilation ([cedb830](https://github.com/lttb/taddy/commit/cedb83010b19ae95ce30dd800e5bbc0e5476c7ca))
- **babel-plugin:** add js imports with re-import for css for remix compat ([557110d](https://github.com/lttb/taddy/commit/557110dfa3f0ae6e86cec58249b747a5198f80fc))
- **babel-plugin:** drop filer fallback ([f7c0ad8](https://github.com/lttb/taddy/commit/f7c0ad820a9b15286649f8016928e90f40502abe))
- **babel-plugin:** fix imported css filename ([9fead46](https://github.com/lttb/taddy/commit/9fead4685c617aec553644b3b811316038b9b3cd))
- **babel-plugin:** improve static eval, update tests ([4e71f98](https://github.com/lttb/taddy/commit/4e71f98304f598ff53b56d68c10fbac0f2c56bd9))
- **babel-plugin:** improvements ([88566d5](https://github.com/lttb/taddy/commit/88566d5ce84ef54ff3ec5a2000e2e684f1f6d0e9))
- **babel-plugin:** local import filename, target ([2d195d5](https://github.com/lttb/taddy/commit/2d195d531dc02ae68598fba0ec94e0492ecaf80f))
- **babel-plugin:** rpc worker pool and next app ([6a48957](https://github.com/lttb/taddy/commit/6a489570fe1b23107ff7ff2ea4dd891f9348d31a))
- **babel-plugin:** update snapshots and tests ([bef1f5e](https://github.com/lttb/taddy/commit/bef1f5e62712b4d3dc37000d0aedb80ec620b48d))
- **babel-plugin:** use filenameRelative from opts ([c11dfa8](https://github.com/lttb/taddy/commit/c11dfa8b9ec5cc3ab4e9009d2c83c6ebee0b0140))
- **babel-plugin:** use string literals for obj keys ([59913c7](https://github.com/lttb/taddy/commit/59913c73d435f2897fcfa5439ec4b6173c90f57e))
- **docs/website:** use taddy styles extraction ([8937332](https://github.com/lttb/taddy/commit/8937332e2f7151691e02524b7244d81861094b95))
- **examples/astro:** add astro example ([043f1eb](https://github.com/lttb/taddy/commit/043f1eb6f3b1191060ecd62e9f5053b4fe9f09b8))
- make it work with vue jsx ([334939e](https://github.com/lttb/taddy/commit/334939e203f5e5a5a6afd34ec093eee429e490cc))
- nextjs app integration ([0083099](https://github.com/lttb/taddy/commit/00830996076a15ac39671a4f2eef025e49a1b9a5))
- support svelte ([d787808](https://github.com/lttb/taddy/commit/d787808d174fc1a5c0e1e9a12314bdb1e57a5821))
- update tests ([f6af45b](https://github.com/lttb/taddy/commit/f6af45b2eab2d10b99a353d56b88695d35fb7a8c))

# [0.1.0-alpha.0](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.28...@taddy/babel-plugin@0.1.0-alpha.0) (2023-03-14)

### Bug Fixes

- drop .gitignore symlink ([c9c01d7](https://github.com/lttb/taddy/commit/c9c01d74bcea51e727f403874d3d9746a8fd585f))
- fix eslint errors ([29651dc](https://github.com/lttb/taddy/commit/29651dc24b1fac34b6260a00373838038187efe8))
- fix some types ([5399b3a](https://github.com/lttb/taddy/commit/5399b3ae6d8615781af4ee4286d1479d81e16db6))
- prettify ([530ee39](https://github.com/lttb/taddy/commit/530ee398c19ac28d881d94c4fe85a3005e37e3d3))

### Features

- **babel-plugin:** drop @babel/core ([c7ada01](https://github.com/lttb/taddy/commit/c7ada01d978fa8253ab8cfcdb2fa88c65072f766))
- **babel-plugin:** make fs methods "filer" friendly ([5e0976c](https://github.com/lttb/taddy/commit/5e0976c296fa7def614bdec376be2eed5ed41768))
- drop tsdx commands ([a833a29](https://github.com/lttb/taddy/commit/a833a290a41ddb92eaea996cc0778f6211b50d26))
- drop vitest ([fad3874](https://github.com/lttb/taddy/commit/fad38747b78658b119b3b39138bb7ea535541ccb))
- restructure ([589ff34](https://github.com/lttb/taddy/commit/589ff34cb83b536072d2936ac24b5802472260e2))
- support at rules ([048f914](https://github.com/lttb/taddy/commit/048f914d569d18f92c8f92d5ec16f3838c0a5064))
- **taddy/babel-plugin:** update tsconfig ([e1277dc](https://github.com/lttb/taddy/commit/e1277dc4e5119eaaa1ce93927f1f4601bfced01f))
- **taddy:** improve at rules types ([7afa564](https://github.com/lttb/taddy/commit/7afa564a71a94f1d8bc2a9652743467154a8d9c6))
- update snapshots ([d98ba78](https://github.com/lttb/taddy/commit/d98ba7837849fabd17a00cbdbd7ab327d2b22df8))
- upgrade dependencies ([f6017e8](https://github.com/lttb/taddy/commit/f6017e8166c805e7d3a5f44cde8198dda951b8d4))

## [0.0.28](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.27...@taddy/babel-plugin@0.0.28) (2020-08-26)

### Features

- make typescript as unstable option, disabled by default ([580f539](https://github.com/lttb/taddy/commit/580f5390b74198f9da0f1e2816f2d0f4becb7c7c))

## [0.0.27](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.26...@taddy/babel-plugin@0.0.27) (2020-08-26)

**Note:** Version bump only for package @taddy/babel-plugin

## [0.0.26](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.25...@taddy/babel-plugin@0.0.26) (2020-08-26)

### Features

- **babel-plugin:** fix template literal mixin handling ([55d4f58](https://github.com/lttb/taddy/commit/55d4f58647bb8526e96ebd03007c77ef6c03c951))
- **babel-plugin, taddy:** fix dynamic css variables, static className, deps ([346dfa1](https://github.com/lttb/taddy/commit/346dfa1bdf13175d310729bfe4910829cba4502c))

## [0.0.25](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.24...@taddy/babel-plugin@0.0.25) (2020-08-26)

### Bug Fixes

- **babel-plugin:** fix variables optimization ([f71b54d](https://github.com/lttb/taddy/commit/f71b54d2bc42ca3250af350cb5cda6e716132ad8))

## [0.0.24](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.23...@taddy/babel-plugin@0.0.24) (2020-08-26)

**Note:** Version bump only for package @taddy/babel-plugin

## [0.0.23](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.22...@taddy/babel-plugin@0.0.23) (2020-08-25)

### Features

- **babel-plugin:** deoptimize mixins in case of predictable runtime ([8c6e54e](https://github.com/lttb/taddy/commit/8c6e54e34541c1c29b3098846d6695bc6cf0e0dd))
- **babel-plugin:** disable "useTaggedTemplateLiterals" by default ([24cea00](https://github.com/lttb/taddy/commit/24cea005d82730d5d5af5e12925455ee075167ba))
- **babel-plugin:** fix bindings optimization ([71b79b1](https://github.com/lttb/taddy/commit/71b79b1d7b24cde894205dd3d8611ba9e781ffc0))
- **babel-plugin:** improve composes handling ([cd999f7](https://github.com/lttb/taddy/commit/cd999f701425e158c5d57245af32c007ecc8af99))
- **babel-plugin:** support experimental tagged template literals ([64f0e2f](https://github.com/lttb/taddy/commit/64f0e2f033e4ae012df599f0b4eca32e8d3fa048))

## [0.0.22](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.21...@taddy/babel-plugin@0.0.22) (2020-08-23)

**Note:** Version bump only for package @taddy/babel-plugin

## [0.0.21](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.20...@taddy/babel-plugin@0.0.21) (2020-08-23)

### Features

- **taddy:** support css declaration merge ([3fe95bc](https://github.com/lttb/taddy/commit/3fe95bc9eda13175697086271f6e534eb8af3b14))

## [0.0.20](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.19...@taddy/babel-plugin@0.0.20) (2020-08-23)

### Bug Fixes

- **babel-plugin:** fix caching and hash calculation ([b672c86](https://github.com/lttb/taddy/commit/b672c8626ad623f92530fbc692e9e9814c515526))

### Features

- support styles merge ([ddd07cc](https://github.com/lttb/taddy/commit/ddd07cc7180b666729bafb00f3fd30ff0c418b44))
- **babel-plugin:** handle ConditionalExpression ([9c1ac61](https://github.com/lttb/taddy/commit/9c1ac61761831daf133b690cb5e917165113b026))

## [0.0.19](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.18...@taddy/babel-plugin@0.0.19) (2020-08-20)

**Note:** Version bump only for package @taddy/babel-plugin

## [0.0.18](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.17...@taddy/babel-plugin@0.0.18) (2020-08-20)

### Features

- **taddy:** fix zero values resolution ([e393724](https://github.com/lttb/taddy/commit/e3937248c2c81fa0a5156b57ffffde99dd653a45))

## [0.0.17](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.16...@taddy/babel-plugin@0.0.17) (2020-08-20)

**Note:** Version bump only for package @taddy/babel-plugin

## [0.0.16](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.15...@taddy/babel-plugin@0.0.16) (2020-08-20)

### Features

- **babel-plugin:** change caching strategy ([54730f3](https://github.com/lttb/taddy/commit/54730f3144e8cf90194667bbcefc414d3776dc78))
- **babel-plugin:** fix website build ([2181ebd](https://github.com/lttb/taddy/commit/2181ebdf292fc7b5e662ad6148d629e904d62403))
- **babel-plugin:** support tsx in tests ([6e0feb4](https://github.com/lttb/taddy/commit/6e0feb4fa97dea0d0e1c3f6afc4499612d767ca6))
- **website:** create ([42f0255](https://github.com/lttb/taddy/commit/42f0255929860ae7527142cecbdb918da6935c0c))
- **website:** update ([2272941](https://github.com/lttb/taddy/commit/22729411c4133d4fd4f053f20f094b2731782596))
- **website:** update home page ([765cb51](https://github.com/lttb/taddy/commit/765cb5125417022cc8ddd26e7b1103323c6b37c1))

## [0.0.15](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.14...@taddy/babel-plugin@0.0.15) (2020-08-18)

### Bug Fixes

- **babel-plugin:** improve workaround ([cad1f3f](https://github.com/lttb/taddy/commit/cad1f3f45c3b90cbf85f70ba6b63a391928ed320))

## [0.0.14](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.13...@taddy/babel-plugin@0.0.14) (2020-08-18)

### Bug Fixes

- **babel-plugin:** add an experimental workaround for virtual environments ([b6dcc6a](https://github.com/lttb/taddy/commit/b6dcc6a3f52b66c24035f594fb05283a7d38771b))

## [0.0.13](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.12...@taddy/babel-plugin@0.0.13) (2020-08-18)

### Bug Fixes

- **babel-plugin:** try to use cwd as fallback ([1d1035e](https://github.com/lttb/taddy/commit/1d1035e6beacfb6901323cd91647b97a099051c8))

## [0.0.12](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.11...@taddy/babel-plugin@0.0.12) (2020-08-18)

### Bug Fixes

- **babel-plugin:** use relative cached module fallback ([3446df7](https://github.com/lttb/taddy/commit/3446df797dd18d16c8a693b436cc3e97d35a4ebb))

## [0.0.11](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.10...@taddy/babel-plugin@0.0.11) (2020-08-18)

### Bug Fixes

- **babel-plugin:** add cached module resolution fallback ([a0c7719](https://github.com/lttb/taddy/commit/a0c7719efc3dda68c3c21198a3af29e8b41c799f))

## [0.0.10](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.9...@taddy/babel-plugin@0.0.10) (2020-08-18)

### Bug Fixes

- **babel-plugin:** resolve cache dir fallback ([ec6e6de](https://github.com/lttb/taddy/commit/ec6e6deb48479c37b63c04e0ea007d221d668151))

## [0.0.9](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.8...@taddy/babel-plugin@0.0.9) (2020-08-18)

### Bug Fixes

- **babel-plugin:** handle cache dir error ([ac49555](https://github.com/lttb/taddy/commit/ac49555250d2789b70a442b05b38324b6dbf93fd))

## [0.0.8](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.7...@taddy/babel-plugin@0.0.8) (2020-08-18)

### Features

- **babel-plugin:** lazy ts-morph load ([52efbd3](https://github.com/lttb/taddy/commit/52efbd3bdc7d2247f740b1f3259d9e770d46942d))

## [0.0.7](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.6...@taddy/babel-plugin@0.0.7) (2020-08-18)

### Features

- support mapStyles ([ac3dbc8](https://github.com/lttb/taddy/commit/ac3dbc8ebc687130c9ac526ce68eb86bf281c29b))

## [0.0.6](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.5...@taddy/babel-plugin@0.0.6) (2020-08-18)

### Features

- support config usage ([d8b457d](https://github.com/lttb/taddy/commit/d8b457de40f9d080ceb0df839df3c30151276b20))

## [0.0.5](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.4...@taddy/babel-plugin@0.0.5) (2020-08-18)

### Features

- **babel-plugin:** expose unstable_CSSVariableFallback option ([2926c59](https://github.com/lttb/taddy/commit/2926c59858c759e35c1adc82af0b6ec4bba4ab7a))

## [0.0.4](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.3...@taddy/babel-plugin@0.0.4) (2020-08-18)

### Bug Fixes

- **babel-plugin:** fix variables evaluation ([7e2d90b](https://github.com/lttb/taddy/commit/7e2d90bddeba57b06ffc8921bd1c6ab7d211ec59))

## [0.0.3](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.2...@taddy/babel-plugin@0.0.3) (2020-08-18)

### Bug Fixes

- **babel-plugin:** dont require css for dev entry ([1c034a2](https://github.com/lttb/taddy/commit/1c034a2376f3d1c00f4be8aa28311e2d3c0cd608))

## [0.0.2](https://github.com/lttb/taddy/compare/@taddy/babel-plugin@0.0.1...@taddy/babel-plugin@0.0.2) (2020-08-18)

### Bug Fixes

- **babel-plugin:** fix cached dev entry ([c7537f4](https://github.com/lttb/taddy/commit/c7537f4deaefd3e73f219bd0187529970ee1689f))

## 0.0.1 (2020-08-17)

**Note:** Version bump only for package @taddy/babel-plugin
