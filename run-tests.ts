#!/usr/bin/env node
import process from 'process';
import { exec } from "child_process"
import util from 'util';
import fs from 'fs';
const execAsync = util.promisify(exec);

const generatedStackCount = 10_000;

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
                const elapsed_ms = await runTest(nodeVersion, compiler, options, args);
                results.push({
                    nodeVersion,
                    compiler,
                    options,
                    generated_stack_count: generatedStackCount,
                    elapsed_ms
                });
            }
        }
    }

    console.table(results);

    // generate markdown table
    const headers = ['image', 'compiler', 'options', 'elapsed_ms'];
    const markdownTable = [
        '| ' + headers.join(' | ') + ' |',
        '| ' + headers.map((it) => '-'.repeat(`${it}`.length)).join(' | ') + ' |',
        ...results.map((result) => '| ' + headers.map((it) => (result as any)[it]).join(' | ') + ' |')
    ].join(`\n`)

    console.log(`### Results for ${generatedStackCount} stack traces.`)
    console.log(markdownTable);
}

async function runTest(nodeVersion: string, compiler: string, options: string, args: string): Promise<number> {

    const description = `node-${nodeVersion}:${compiler}:${options}`
    console.info(`running test for ${description}...`);

    // Switch node versions
    await execAsync(`n install ${nodeVersion}`);
    const {stdout: nodeVersionCheck} = await execAsync(`node --version`);
    if(nodeVersionCheck !== `v${nodeVersion}\n`) throw new Error('Failed to switch node versions');

    // Run benchmark with hyperfine
    const hyperfineExportPath = `${description.replace(/[ :@/]/g, '_')}.hyperfine.json`;
    const cmd = `hyperfine --time-unit millisecond --export-json ${hyperfineExportPath} "node ./lib-${compiler}/index.js ${args}"`;
    const { stdout, stderr } = await execAsync(cmd, {
        env: {
            ...process.env,
            NODE_OPTIONS: options
        }
    });
    console.log(stdout);

    // Read benchmark results
    const hyperfineResults = JSON.parse(fs.readFileSync(hyperfineExportPath, 'utf8')) as HyperFineResults;
    interface HyperFineResults {
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

    const elapsed = Math.round(hyperfineResults.results[0].mean * 1e3);
    return elapsed;
}



main().catch((e) => {
    console.error(e);
    process.exit(1);
})
