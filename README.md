# Source Map Performance Demo

This project is a simple experiment to get a general sense of the correctness
and performance penalty incurred for enabling source map support in a node
runtime using various techniques.

The approach taken is to generate builds of a simple application using 
both `esbuild` and `tsc`. The application imports a few commonly used libraries
to intentionally inflate the resulting source maps. We then generate N number of
stack traces, and record the elapsed time. 

- `index.ts` - simple test app to generate stacks and test their correctness
- `run-tests.ts` - run timing tests for combinations of node version, compiler, and sourcemap support options.

Related Discussions:
- https://github.com/nodejs/node/issues/41541
- https://github.com/nodejs/node/issues/42417
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
| node | compiler | options | stack_traces_correct | elapsed_ms |
| ---- | -------- | ------- | -------------------- | ---------- |
| 14.19.1 | esbuild | --enable-source-maps | ❌ | 366404 |
| 14.19.1 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 652 |
| 14.19.1 | esbuild | -r source-map-support/register | ❌ | 807 |
| 14.19.1 | esbuild |  |  | 230 |
| 14.19.1 | tsc | --enable-source-maps | ❌ | 1916 |
| 14.19.1 | tsc | -r @cspotcode/source-map-support/register | ✅ | 673 |
| 14.19.1 | tsc | -r source-map-support/register | ❌ | 642 |
| 14.19.1 | tsc |  |  | 268 |
| 16.14.2 | esbuild | --enable-source-maps | ❌ | 358514 |
| 16.14.2 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 542 |
| 16.14.2 | esbuild | -r source-map-support/register | ❌ | 748 |
| 16.14.2 | esbuild |  |  | 222 |
| 16.14.2 | tsc | --enable-source-maps | ❌ | 1870 |
| 16.14.2 | tsc | -r @cspotcode/source-map-support/register | ✅ | 547 |
| 16.14.2 | tsc | -r source-map-support/register | ❌ | 576 |
| 16.14.2 | tsc |  |  | 236 |
| 17.8.0 | esbuild | --enable-source-maps | ❌ | 367329 |
| 17.8.0 | esbuild | -r @cspotcode/source-map-support/register | ✅ | 598 |
| 17.8.0 | esbuild | -r source-map-support/register | ❌ | 737 |
| 17.8.0 | esbuild |  |  | 202 |
| 17.8.0 | tsc | --enable-source-maps | ❌ | 1726 |
| 17.8.0 | tsc | -r @cspotcode/source-map-support/register | ✅ | 539 |
| 17.8.0 | tsc | -r source-map-support/register | ❌ | 535 |
| 17.8.0 | tsc |  |  | 244 |
