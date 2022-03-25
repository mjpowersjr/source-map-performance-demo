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

const start = Date.now();

for (let i = 0; i < max; i++) {
    // console.log(`generating stack trace ${i+1}...`);
    const err = new Error();
    const { stack } = err;
    if(i === 0) {
        const re = /at Object\.<anonymous> \(.*source-map-performance-demo\/index\.ts:33:17/
        if(!re.test(stack!)) {
            throw new Error('Stack trace looks wrong');
        }
    }
    // schema.validate(err);
}

const end = Date.now();
console.log(end - start);
