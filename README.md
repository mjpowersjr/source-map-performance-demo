# Source Map Performance Demo

This project is a simple experiment to get a general sense of the performance penalty
incurred for enabling source map support in a node runtime using various techniques.

## Usage
Requirements:
* Node v14+
* Docker
* yarn

```sh
# install deps
yarn

# build
yarn clean && yarn build

# run tests
yarn test
```


## Example Output
```
┌─────────┬─────────────────────┬───────────┬─────────────────────────────────────────────┬───────────────────────┬────────────┐
│ (index) │        image        │ compiler  │                   options                   │ generated_stack_count │ elapsed_ms │
├─────────┼─────────────────────┼───────────┼─────────────────────────────────────────────┼───────────────────────┼────────────┤
│    0    │ 'node:14.19-alpine' │ 'esbuild' │           '--enable-source-maps'            │         10000         │    4891    │
│    1    │ 'node:14.19-alpine' │ 'esbuild' │ '-r @cspotcode/source-map-support/register' │         10000         │    117     │
│    2    │ 'node:14.19-alpine' │ 'esbuild' │      '-r source-map-support/register'       │         10000         │    306     │
│    3    │ 'node:14.19-alpine' │ 'esbuild' │                     ''                      │         10000         │     7      │
│    4    │ 'node:14.19-alpine' │   'tsc'   │           '--enable-source-maps'            │         10000         │     93     │
│    5    │ 'node:14.19-alpine' │   'tsc'   │ '-r @cspotcode/source-map-support/register' │         10000         │     67     │
│    6    │ 'node:14.19-alpine' │   'tsc'   │      '-r source-map-support/register'       │         10000         │     48     │
│    7    │ 'node:14.19-alpine' │   'tsc'   │                     ''                      │         10000         │     9      │
│    8    │ 'node:16.14-alpine' │ 'esbuild' │           '--enable-source-maps'            │         10000         │    4192    │
│    9    │ 'node:16.14-alpine' │ 'esbuild' │ '-r @cspotcode/source-map-support/register' │         10000         │    108     │
│   10    │ 'node:16.14-alpine' │ 'esbuild' │      '-r source-map-support/register'       │         10000         │    281     │
│   11    │ 'node:16.14-alpine' │ 'esbuild' │                     ''                      │         10000         │     11     │
│   12    │ 'node:16.14-alpine' │   'tsc'   │           '--enable-source-maps'            │         10000         │     87     │
│   13    │ 'node:16.14-alpine' │   'tsc'   │ '-r @cspotcode/source-map-support/register' │         10000         │     57     │
│   14    │ 'node:16.14-alpine' │   'tsc'   │      '-r source-map-support/register'       │         10000         │     42     │
│   15    │ 'node:16.14-alpine' │   'tsc'   │                     ''                      │         10000         │     5      │
│   16    │ 'node:17.8-alpine'  │ 'esbuild' │           '--enable-source-maps'            │         10000         │    4333    │
│   17    │ 'node:17.8-alpine'  │ 'esbuild' │ '-r @cspotcode/source-map-support/register' │         10000         │    113     │
│   18    │ 'node:17.8-alpine'  │ 'esbuild' │      '-r source-map-support/register'       │         10000         │    257     │
│   19    │ 'node:17.8-alpine'  │ 'esbuild' │                     ''                      │         10000         │     9      │
│   20    │ 'node:17.8-alpine'  │   'tsc'   │           '--enable-source-maps'            │         10000         │     72     │
│   21    │ 'node:17.8-alpine'  │   'tsc'   │ '-r @cspotcode/source-map-support/register' │         10000         │     65     │
│   22    │ 'node:17.8-alpine'  │   'tsc'   │      '-r source-map-support/register'       │         10000         │     43     │
│   23    │ 'node:17.8-alpine'  │   'tsc'   │                     ''                      │         10000         │     6      │
└─────────┴─────────────────────┴───────────┴─────────────────────────────────────────────┴───────────────────────┴────────────┘
```
