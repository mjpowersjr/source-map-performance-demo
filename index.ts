// random collection of common libraries
import { object, } from 'yup';
import _ from 'lodash';
import express from 'express';
import chalk from 'chalk';

// random code to prevent unused imports from being optimized away
const fishtank = {
    red: chalk.red('fish')
};

_.assign(fishtank, { 
    blue: chalk.blue('fish')
});

const schema = object({
});
schema.validate(fishtank);

const app = express();


// test stack trace performance
const args = process.argv.slice(2);
const max = args[0]
    ? parseInt(args[0])
    : 10_000;
const isUsingSourcemaps = args[1] === 'true';

let stackTracesAreCorrect: boolean | null = null;

async function main() {
    const start = Date.now();

    await loop();

    const end = Date.now();
    console.log(JSON.stringify({duration: end - start, stackTracesAreCorrect}));
}

async function loop() {
    // Take one lap around the event loop
    await void 0;

    for (let i = 0; i < max; i++) {
        // console.log(`generating stack trace ${i+1}...`);
        const err = new Error();
        const { stack } = err;
        if(i === 0) {
            console.dir(stack);
            const sourceMapRe = /at loop \(.*\/index\.ts:47:21\)\n    at async main \(.*\/index\.ts:35:5\)/
            const nonSourceMapRe = /at loop \(.*\.js:.*?\)\n    at async main \(.*\.js:.*?\)/
            if((isUsingSourcemaps ? sourceMapRe : nonSourceMapRe).test(stack!)) {
                if(isUsingSourcemaps) stackTracesAreCorrect = true;
            } else {
                stackTracesAreCorrect = false;
                if(!isUsingSourcemaps) throw new Error('invariant violated');
                // throw new Error(`Stack trace looks wrong.\nStack is:\n${require('util').inspect(stack)}`);
            }
        }
        // schema.validate(err);
    }
}

main();
