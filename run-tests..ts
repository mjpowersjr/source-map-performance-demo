import process from 'process';
import { exec } from "child_process"
import util from 'util';
const execAsync = util.promisify(exec);

const generatedStackCount = 10_000;

const images = [
    'node:14.19-alpine',
    'node:16.14-alpine',
    'node:17.8-alpine',
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

    const args = [`${generatedStackCount}`];

    const results = [];
    for (const image of images) {
        for (const compiler of compilers) {
            for (const options of optionSets) {
                const elapsed_ms = await runTest(image, compiler, options, args);
                results.push({
                    image,
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

    console.log(markdownTable);
}

async function runTest(image: string, compiler: string, options: string, args: string[]): Promise<number> {

    const description = `${image}:${compiler}:${options}`
    console.info(`running test for ${description}...`);

    const cmd = [
        'docker',
        'run',
        '--rm',
        '--volume',
        `"${process.env.PWD}":/app`,
        `--env NODE_OPTIONS="${options}"`,
        `--workdir`,
        `/app`,
        image,
        `/app/lib-${compiler}/index.js`,
        ...args,
    ].join(' ');

    const { stdout, stderr } = await execAsync(cmd);
    // Docker outputs to stderr when downloading remote images
    // if (stderr) {
    //     throw new Error(stderr);
    // }

    const elapsed = parseInt(stdout.trim());
    return elapsed;
}



main().catch((e) => {
    console.error(e);
    process.exit(1);
})
