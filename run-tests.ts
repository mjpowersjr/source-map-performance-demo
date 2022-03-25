#!/usr/bin/env node
import process from 'process';
import { exec } from "child_process"
import util from 'util';
import fs from 'fs';
const execAsync = util.promisify(exec);

const generatedStackCount = 10_000;
// const generatedStackCount = 1000;
// const generatedStackCount = 1;

const nodeVersions = [
    '14.19.1',
    '16.14.2',
    '17.8.0'
]

const compilers = [
    'esbuild',
    'tsc',
];

const optionSets = [
    '--enable-source-maps',
    '-r @cspotcode/source-map-support/register',
    '-r source-map-support/register',
    '', // no sourcemap support
];


async function main() {

    const args = `${generatedStackCount}`;

    const results = [];
    for (const nodeVersion of nodeVersions) {
        for (const compiler of compilers) {
            for (const options of optionSets) {
                const {elapsed_ms, stackTracesAreCorrect} = await runTest(nodeVersion, compiler, options, args);
                results.push({
                    node: nodeVersion,
                    compiler,
                    options,
                    generated_stack_count: generatedStackCount,
                    elapsed_ms,
                    stack_traces_correct: stackTracesAreCorrect
                });
            }
        }
    }

    console.table(results);

    // generate markdown table
    const headers: Array<keyof typeof results[0]> = ['node', 'compiler', 'options', 'stack_traces_correct', 'elapsed_ms'];
    const markdownTable = [
        '| ' + headers.join(' | ') + ' |',
        '| ' + headers.map((it) => '-'.repeat(`${it}`.length)).join(' | ') + ' |',
        ...results.map((result) => '| ' + headers.map((it) => {
            if(it === 'stack_traces_correct') return result[it] === true ? '✅' : result[it] === false ? '❌' : '';
            return result[it];
        }).join(' | ') + ' |')
    ].join(`\n`)

    console.log(`### Results for ${generatedStackCount} stack traces.`)
    console.log(markdownTable);
}

async function runTest(nodeVersion: string, compiler: string, options: string, args: string) {

    const description = `node-${nodeVersion}:${compiler}:${options}`
    console.info(`running test for ${description}...`);

    // Switch node versions
    await execAsync(`n install ${nodeVersion}`);
    const {stdout: nodeVersionCheck} = await execAsync(`node --version`);
    if(nodeVersionCheck !== `v${nodeVersion}\n`) throw new Error('Failed to switch node versions');

    // Run benchmark with hyperfine
    const hyperfineExportPath = `${description.replace(/[ :@/]/g, '_')}.hyperfine.json`;
    let hyperfineOptions = '';
    if(options === '--enable-source-maps' && compiler.includes('esbuild')) {
        // node's built-in sourcemap support is *extremely* slow for some reason.  Tell hyperfine to run it only once.
        hyperfineOptions = '-w 0 -r 1'
    }
    // When sourcemaps are not enabled, skip asserting that the stacktrace looks correct
    const isUsingSourcemaps = options !== '';
    const cmd = `hyperfine ${hyperfineOptions} --show-output --time-unit millisecond --export-json ${hyperfineExportPath} "node ./lib-${compiler}/index.js ${args} ${isUsingSourcemaps}"`;
    const { stdout, stderr } = await execAsync(cmd, {
        env: {
            ...process.env,
            NODE_OPTIONS: options
        }
    });
    console.log(stdout);
    const jsReport = JSON.parse(stdout.match(/\n\{[^\n]+?\}\n/)![0]) as {duration: number, stackTracesAreCorrect: boolean};
    const {stackTracesAreCorrect} = jsReport;

    // Read benchmark results
    const hyperfineReport = JSON.parse(fs.readFileSync(hyperfineExportPath, 'utf8')) as HyperfineReport;
    interface HyperfineReport {
        results: Array<{
            command: string;
            mean: number;
            stddev: number;
            median: number;
            user: number;
            system: number;
            min: number;
            max: number;
            times: Array<number>;
        }>;
    }

    const elapsed_ms = Math.round(hyperfineReport.results[0].mean * 1e3);
    return {elapsed_ms, stackTracesAreCorrect};
}



main().catch((e) => {
    console.error(e);
    process.exit(1);
})
