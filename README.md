# Source Map Performance Demo

This project is a simple experiment to get a general sense of the performance penalty
incurred for enabling source map support in a node runtime using various techniques.

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

| image | compiler | options | elapsed_ms |
| ----- | -------- | ------- | ---------- |
| node:14.19-alpine | esbuild | --enable-source-maps | 4756 |
| node:14.19-alpine | esbuild | -r @cspotcode/source-map-support/register | 115 |
| node:14.19-alpine | esbuild | -r source-map-support/register | 294 |
| node:14.19-alpine | esbuild |  | 7 |
| node:14.19-alpine | tsc | --enable-source-maps | 110 |
| node:14.19-alpine | tsc | -r @cspotcode/source-map-support/register | 73 |
| node:14.19-alpine | tsc | -r source-map-support/register | 47 |
| node:14.19-alpine | tsc |  | 7 |
| node:16.14-alpine | esbuild | --enable-source-maps | 4268 |
| node:16.14-alpine | esbuild | -r @cspotcode/source-map-support/register | 137 |
| node:16.14-alpine | esbuild | -r source-map-support/register | 263 |
| node:16.14-alpine | esbuild |  | 11 |
| node:16.14-alpine | tsc | --enable-source-maps | 83 |
| node:16.14-alpine | tsc | -r @cspotcode/source-map-support/register | 62 |
| node:16.14-alpine | tsc | -r source-map-support/register | 45 |
| node:16.14-alpine | tsc |  | 5 |
| node:17.8-alpine | esbuild | --enable-source-maps | 4565 |
| node:17.8-alpine | esbuild | -r @cspotcode/source-map-support/register | 115 |
| node:17.8-alpine | esbuild | -r source-map-support/register | 270 |
| node:17.8-alpine | esbuild |  | 8 |
| node:17.8-alpine | tsc | --enable-source-maps | 73 |
| node:17.8-alpine | tsc | -r @cspotcode/source-map-support/register | 68 |
| node:17.8-alpine | tsc | -r source-map-support/register | 42 |
| node:17.8-alpine | tsc |  | 6 |
