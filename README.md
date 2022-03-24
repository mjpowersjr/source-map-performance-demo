# Source Map Performance Demo

This project is a simple experiment to get a general sense of the performance penalty
incurred for enabling source map support in a node runtime using various techniques.

The approach taken is to generate builds of a simple application using 
both `esbuild` and `tsc`. The application imports a few commonly used libraries
to intentionally inflate the resulting source maps. We then generate N number of
source maps, and record the elapsed time. 

- `index.ts` - simple test app to generate stacks and record elapsed time
- `run-tests.ts` - run timing tests for combinations of node version, compiler, and sourcemap support options.

Related Discussions:
- https://github.com/nodejs/node/issues/41541
- https://github.com/evanw/node-source-map-support/issues/122

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

### Results for 10000 stack traces.
| image | compiler | options | elapsed_ms |
| ----- | -------- | ------- | ---------- |
| node:14.19-alpine | esbuild | --enable-source-maps | 4754 |
| node:14.19-alpine | esbuild | -r @cspotcode/source-map-support/register | 119 |
| node:14.19-alpine | esbuild | -r source-map-support/register | 289 |
| node:14.19-alpine | esbuild |  | 7 |
| node:14.19-alpine | tsc | --enable-source-maps | 88 |
| node:14.19-alpine | tsc | -r @cspotcode/source-map-support/register | 70 |
| node:14.19-alpine | tsc | -r source-map-support/register | 48 |
| node:14.19-alpine | tsc |  | 6 |
| node:16.14-alpine | esbuild | --enable-source-maps | 4260 |
| node:16.14-alpine | esbuild | -r @cspotcode/source-map-support/register | 115 |
| node:16.14-alpine | esbuild | -r source-map-support/register | 285 |
| node:16.14-alpine | esbuild |  | 8 |
| node:16.14-alpine | tsc | --enable-source-maps | 94 |
| node:16.14-alpine | tsc | -r @cspotcode/source-map-support/register | 71 |
| node:16.14-alpine | tsc | -r source-map-support/register | 45 |
| node:16.14-alpine | tsc |  | 6 |
| node:17.8-alpine | esbuild | --enable-source-maps | 4298 |
| node:17.8-alpine | esbuild | -r @cspotcode/source-map-support/register | 112 |
| node:17.8-alpine | esbuild | -r source-map-support/register | 280 |
| node:17.8-alpine | esbuild |  | 9 |
| node:17.8-alpine | tsc | --enable-source-maps | 116 |
| node:17.8-alpine | tsc | -r @cspotcode/source-map-support/register | 59 |
| node:17.8-alpine | tsc | -r source-map-support/register | 41 |
| node:17.8-alpine | tsc |  | 5 |
