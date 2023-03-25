const fs = require('fs');
const path = require('path');
const process = require('process');
const util = require('util');
const child_process = require('child_process');
const { exit } = require('process');
const exec = util.promisify(child_process.exec);

const COLORS = {
	Reset: '\x1b[0m',
	Bright: '\x1b[1m',
	Dim: '\x1b[2m',
	Underscore: '\x1b[4m',
	Blink: '\x1b[5m',
	Reverse: '\x1b[7m',
	Hidden: '\x1b[8m',

	FgBlack: '\x1b[30m',
	FgRed: '\x1b[31m',
	FgGreen: '\x1b[32m',
	FgYellow: '\x1b[33m',
	FgBlue: '\x1b[34m',
	FgMagenta: '\x1b[35m',
	FgCyan: '\x1b[36m',
	FgWhite: '\x1b[37m',
	FgGray: '\x1b[90m',

	BgBlack: '\x1b[40m',
	BgRed: '\x1b[41m',
	BgGreen: '\x1b[42m',
	BgYellow: '\x1b[43m',
	BgBlue: '\x1b[44m',
	BgMagenta: '\x1b[45m',
	BgCyan: '\x1b[46m',
	BgWhite: '\x1b[47m',
	BgGray: '\x1b[100m',
};

const indentStr = (str, indents = 0, indentSize = 2) => {
	let indentStr = '';
	for (let i = 0; i < indents * indentSize; i++) indentStr += ' ';
	return indentStr + str.split('\n').join('\n' + indentStr);
};

const info = (str, n = 0, reset = true) => console.log(COLORS.Reset, indentStr('[INFO]: ' + str, n));
const succ = (str, n = 0) => console.log(COLORS.Reset, COLORS.FgGreen, indentStr('[SUCCESS]: ' + str, n), COLORS.Reset);
const warn = (str, n = 0) => console.log(COLORS.Reset, COLORS.FgYellow, indentStr('[WARN]: ' + str, n), COLORS.Reset);
const warnInfo = (str, n = 0) => console.log(COLORS.Reset, COLORS.FgYellow, indentStr(str, n), COLORS.Reset);
const fail = (str, n = 0) => console.log(COLORS.Reset, COLORS.FgRed, indentStr('[ERROR]: ' + str, n), COLORS.Reset);
const failInfo = (str, n = 0) => console.log(COLORS.Reset, COLORS.FgRed, indentStr(str, n), COLORS.Reset);

// TODO: Rename "Problems" to tasks or something like that?

const HELP_TEXT = `Usage: "node test [Options] <Problems>
    <Problems> is a space-separated list of problems to test. Each Problem should be the name of the problem.
    The special name "all" will test all problems.
Options:
    -l=<Languages>   Set the list of languages that should be tested. The list of languages should be comma-separated.
                     For now, the languages are identified by the extensions only.
                     Providing an empty list means to test all languages.
    -r    --record   Record the outputs of all tests that are run as the new expected output.
                     Not supported yet.
    -h    --help     Show this Help text. Any options and problems provided will be ignored.`;

const EXT_TO_CMD = {
	js: (file, name, input) => `node ${file} ${input}`,
	py: (file, name, input) => `py ${file} ${input}`,
	c: (file, name, input) => [`gcc -o ${name} ${file}`, `${name} ${input}`],
};

function getTestJsons(dir = __dirname) {
	const res = [];
	fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
		if (dirent.isFile() && dirent.name == 'tests.json') {
			res.push(path.join(dir, dirent.name));
		} else if (dirent.isDirectory()) {
			res.push(...getTestJsons(path.join(dir, dirent.name)));
		}
	});
	return res;
}

// Return list of objects: [{name, inputs, outputs, files}]
// TODO: Expected Return value doesn't match actual return values
function getProblemFiles(jsonpaths, langs, problems, allTests, allLangs) {
	const foundLangs = {};
	for (const l of langs) {
		foundLangs[l] = false;
	}

	const files = [];
	jsonpaths.forEach((fd) => {
		const json = JSON.parse(fs.readFileSync(fd, { encoding: 'utf-8' }));
		const dir = path.dirname(fd);
		const dirents = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isFile());
		for (const key in json) {
			const k = key.toLowerCase();
			const idx = problems.findIndex((p) => p == k);
			if (allTests || idx >= 0) {
				problems.pop(idx);
				const testFiles = dirents
					.filter(
						(d) =>
							d.name.startsWith(key + '.') &&
							(allLangs ||
								langs.find((l) => {
									if (d.name.endsWith(l)) {
										foundLangs[l] = true;
										return true;
									} else return false;
								}))
					)
					.map((f) => path.join(dir, f.name));

				if (testFiles.length === 0) {
					if (allLangs) {
						warn(`No files with the name "${key}" could be found.`);
					} else {
						warn(`No ${langs.join(',')} file with the name "${key}" could be found.`);
					}
					continue;
				}

				const test = { name: key, inputs: [], outputs: [], files: testFiles };

				let testcases = json[key];
				if (!Array.isArray(testcases)) testcases = [testcases];
				for (const testcase of testcases) {
					if (typeof testcase.input !== 'string' || typeof testcase.output !== 'string') {
						console.error('Input or output of testcase are expected to be strings. Instead received `' + JSON.stringify(testcase) + '` as testcase.');
						exit(1);
					}
					test.inputs.push(testcase.input);
					test.outputs.push(testcase.output);
				}
				files.push(test);
			}
		}

		for (const p of problems) {
			warn(`No testcases were found for "${p}".`);
		}
		for (const l in foundLangs) {
			if (!foundLangs[l]) {
				warn(`No file for the language "${l}" was found.`);
			}
		}
	});
	return files;
}

async function test(name, files, inputs, outputs, toRecord) {
	if (toRecord) {
		console.error("Recording hasn't been implemented yet");
		exit(1);
	}

	if (files.length === 0) {
		console.error('There should always be files provided to test. Something went wrong.');
		exit(1);
	}

	info(`Testing "${name}"`);
	// console.log({ name, files, inputs, outputs, toRecord });
	for await (const f of files) {
		let ext = f.split('.').at(-1);
		if (EXT_TO_CMD[ext] === undefined) {
			// TODO: Error Handling
			console.error("Error Handling for Testing isn't implemented yet");
			exit(1);
		} else {
			// TODO: Check that inputs and outputs have the same length
			// TODO: Allow non-arrays by transforming strings to arrays
			// TODO: Change code in other places to expect arrays instead of strings to inputs/outputs
			let success = true;
			for (let i = 0; success && i < inputs.length; i++) {
				const input = inputs[i];
				const output = outputs[i];
				let cmds = EXT_TO_CMD[ext](f, name, input);
				let res;
				if (!Array.isArray(cmds)) cmds = [cmds];
				for (const cmd of cmds) {
					try {
						res = await exec(cmd);
					} catch (error) {
						success = false;
						fail(`${name}.${ext} failed.`, 0);
						failInfo(`Input:`, 1);
						failInfo(`${input}`, 2);
						failInfo(`Error Code:`, 1);
						failInfo(`${error.status ?? 'Unknown'}`, 2);
						failInfo(`Error Message:`, 1);
						failInfo(`${error.message}`, 2);
						res = undefined;
						break;
					}
				}

				if (res && output.trim() !== res.stdout.trim()) {
					success = false;
					fail(`${name}.${ext} didn't produce the expected output:`);
					failInfo('Input:', 1);
					failInfo(`${input}`, 2);
					failInfo(`Expected:`, 1);
					failInfo(output, 2);
					failInfo(`Received:`, 1);
					failInfo(res.stdout, 2);
				}
			}

			if (success) {
				succ(`${name}.${ext} ran successfully`);
			}
		}
	}
}

async function main() {
	const args = process.argv.slice(2);
	if (args.length === 0) {
		console.log(HELP_TEXT);
		exit(1);
	}
	const flags = {
		allTests: false,
		allLangs: false,
		problems: [],
		langs: [],
		rec: false,
		help: false,
	};
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg == 'all') flags.allTests = true;
		else if (arg == '-h' || arg == '--help') flags.help = true;
		else if (arg == '-r' || arg == '--record') flags.rec = true;
		else if (arg.startsWith('-l')) {
			let a = arg.split('=');
			if (a.length == 1) {
				if (i + 1 == args.length) {
					console.error(`The command line option "-l" requires arguments to be given after an "=".\nSee "-help" for more information on how to use the option correctly.`);
					exit(1);
				}
				let next = args[++i];
				if (next.startsWith('-')) {
					console.error(`The command line option "-l" requires arguments to be given after an "=".\nSee "-help" for more information on how to use the option correctly.`);
					exit(1);
				}
				if (next == '=') {
					if (i + 1 == args.length) {
						console.error(`The command line option "-l" requires arguments to be given after an "=".\nSee "-help" for more information on how to use the option correctly.`);
						exit(1);
					}
					next = args[++i];
				} else if (next.startsWith('=')) next = next.slice(1);
				flags.langs = next.split(',');
			} else {
				flags.langs = a[1].split(',');
			}
		} else {
			flags.problems.push(arg);
		}
	}

	if (flags.help) {
		console.log(HELP_TEXT);
		exit(0);
	}

	flags.problems = flags.problems.map((p) => p.toLowerCase());
	flags.langs = flags.langs.map((l) => {
		if (l.startsWith('.')) l = l.slice(1);
		return l.toLowerCase();
	});
	if (flags.langs.length === 0) flags.allLangs = true;

	let toTest = getProblemFiles(getTestJsons(path.join(__dirname)), flags.langs, flags.problems, flags.allTests, flags.allLangs);
	for await (const t of toTest) {
		await test(t.name, t.files, t.inputs, t.outputs, flags.rec);
	}
}

main();
