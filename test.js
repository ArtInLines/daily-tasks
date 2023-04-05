const fs = require('fs');
const path = require('path');
const process = require('process');
const util = require('util');
const child_process = require('child_process');
const { exit } = require('process');
const exec = util.promisify(child_process.exec);

// TODO: Add ignored Folders

// The kotlin compiler takes up to 8 seconds even for simple programs
// Since kotlin programs should still be accepted, the time-limit for commands is currently set at 8s
const TIME_LIMIT_PER_CMD = 8000; // in ms

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

// Additional Offset exists because the color codes take up a character too and newlines aren't on the same column if they aren't offset by the same amount
const indentStr = (str, indents = 0, indentSize = 2, additionalOffset = 1) => {
	let indentStr = '';
	for (let i = 0; i < indents * indentSize; i++) indentStr += ' ';
	let offsetStr = '';
	for (let i = 0; i < additionalOffset; i++) offsetStr += ' ';
	return (
		indentStr +
		str
			.split('\n')
			.map((x, i) => (i > 0 ? offsetStr + x : x))
			.join('\n' + indentStr)
	);
};

const info = (str, n = 0, reset = true) => console.log(reset ? COLORS.Reset : '', indentStr('[INFO]: ' + str, n));
const succ = (str, n = 0) => console.log(COLORS.FgGreen, indentStr('[SUCCESS]: ' + str, n), COLORS.Reset);
const warn = (str, n = 0) => console.log(COLORS.FgYellow, indentStr('[WARN]: ' + str, n), COLORS.Reset);
const warnInfo = (str, n = 0) => console.log(COLORS.FgYellow, indentStr(str, n), COLORS.Reset);
const fail = (str, n = 0) => console.log(COLORS.FgRed, indentStr('[ERROR]: ' + str, n), COLORS.Reset);
const failInfo = (str, n = 0) => console.log(COLORS.FgRed, indentStr(str, n), COLORS.Reset);
const debug = (str, n = 0) => console.log(COLORS.FgBlue, indentStr('[DEBUG]: ' + str, n), COLORS.Reset);
const debugInfo = (str, n = 0) => console.log(COLORS.FgBlue, indentStr(str, n), COLORS.Reset);

const failExit = (code = 1) => {
	console.log('\n');
	console.log(COLORS.FgRed, 'Exitted with code ' + code, COLORS.Reset);
	exit(code);
};

// TODO: Rename "Problems" to tasks or something like that?

const HELP_TEXT = `Usage: "node test [Options] <Problems>
    <Problems> is a space-separated list of problems to test. Each Problem should be the name of the problem.
    The special name "all" will test all problems.
Options:
    -l=<Languages>   Set the list of languages that should be tested. The list of languages should be comma-separated.
                     For now, the languages are identified by the extensions only.
                     Providing an empty list means to test all languages.
    -d=<Directories> Set the list of Directories to look for TestJsons. Only relative paths are accepted at the moment.
					 Providing an empty list means to use all TestJsons in the working directory and subdirectories below.
	-r    --record   Record the outputs of all tests that are run as the new expected output.
                     Not supported yet.
    -h    --help     Show this Help text. Any options and problems provided will be ignored.`;

const EXT_TO_CMD = {
	js: { run: (input, name) => `node ${name}.js ${input}` },
	py: { run: (input, name) => `py ${name}.py ${input}` },
	c: { pre: (name) => `gcc -o ${name} ${name}.c`, run: (input, name) => `${name} ${input}` },
	rs: { pre: (name) => `rustc ${name}.rs -o ${name}.exe`, run: (input, name) => `${name} ${input}` },
	java: { pre: (name) => `javac ${name}.java`, run: (input, name) => `java ${name} ${input}` },
	stlx: { run: (input, name) => `setlX ${name}.stlx --params ${input}` },
	jl: { run: (input, name) => `julia ${name}.jl ${input}` },
	lsp: { run: (input, name) => `sbcl --noinform --load ${name}.lsp --quit ${input}` },
	rb: { run: (input, name) => `ruby ${name}.rb ${input}` },
	kt: { pre: (name) => `kotlinc ${name}.kt -include-runtime -d ${name}.jar`, run: (input, name) => `java -jar ${name}.jar ${input}` },
};

const IGNORED_EXTS = ['exe', 'o', 'class', 'pyc', 'pdb', 'jar'];

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

function getFilesRecursively(basedir, basename, allLangs, langs, recdirs = [], foundLangs = []) {
	basename = basename.toLowerCase();
	const currentDirName = recdirs.length === 0 ? basedir : recdirs.at(-1);
	const dirents = fs.readdirSync(path.join(basedir, ...recdirs), { withFileTypes: true });
	const a = dirents
		.filter(
			(d) =>
				((d.isFile() && currentDirName.toLowerCase() === basename) || d.name.toLowerCase().startsWith(basename + '.')) &&
				(allLangs ||
					langs.find((l) => {
						if (d.name.endsWith(l)) {
							foundLangs[l] = true;
							return true;
						} else return false;
					}))
		)
		.map((d) => d.name);
	const b = dirents.filter((d) => d.isDirectory()).flatMap((d) => getFilesRecursively(basedir, basename, allLangs, langs, [...recdirs, d.name], foundLangs));
	return [...a.map((x) => path.join(...recdirs, x)), ...b];
}

// Return list of objects: [{name, inputs, outputs, files}]
function getProblemFiles(jsonpaths, langs, problems, allTests, allLangs) {
	const foundLangs = {};
	for (const l of langs) {
		foundLangs[l] = false;
	}

	const tests = [];
	jsonpaths.forEach((fd) => {
		const json = JSON.parse(fs.readFileSync(fd, { encoding: 'utf-8' }));
		const dir = path.dirname(fd);
		for (const key in json) {
			const k = key.toLowerCase();
			const idx = problems.findIndex((p) => p == k);
			if (allTests || idx >= 0) {
				problems.pop(idx);
				const testFiles = getFilesRecursively(dir, key, allLangs, langs, [], foundLangs).map((f) => path.join(dir, f));

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
						fail('Input or output of testcase are expected to be strings. Instead received `' + JSON.stringify(testcase) + '` as testcase.');
						failExit(1);
					}
					test.inputs.push(testcase.input);
					test.outputs.push(testcase.output);
				}
				tests.push(test);
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
	return tests;
}

async function runCommand(cmd, f, name, ext, input = null) {
	// info("Running Command '" + cmd + "'");
	return exec(cmd, { cwd: path.dirname(f), signal: AbortSignal.timeout(TIME_LIMIT_PER_CMD) }).catch((reason) => {
		fail(`${path.basename(f)} failed.`, 0);
		failInfo(`Command:`, 1);
		failInfo(`${cmd}`, 2);
		if (input !== null) {
			failInfo(`Input:`, 1);
			failInfo(`${input}`, 2);
		}
		if (reason.name === 'AbortError') {
			failInfo(`Reason:`, 1);
			failInfo(`Command took more than ${TIME_LIMIT_PER_CMD}ms.`, 2);
		} else {
			failInfo(`Error Code:`, 1);
			failInfo(`${reason.code ?? 'Unknown'}`, 2);
		}
		if (reason.stdout) {
			failInfo(`Stdout:`, 1);
			failInfo(`${reason.stdout}`, 2);
		}
		if (reason.stderr) {
			failInfo(`Stderr:`, 1);
			failInfo(`${reason.stderr}`, 2);
		}
		return null;
	});
}

async function test(name, files, inputs, outputs, toRecord) {
	if (toRecord) {
		fail("Recording hasn't been implemented yet");
		failExit(1);
	}

	if (files.length === 0) {
		fail('There should always be files provided to test. Something went wrong.');
		failExit(1);
	}

	info(`Testing "${name}"`);
	// console.log({ name, files, inputs, outputs, toRecord });
	for await (const f of files) {
		let ext = path.extname(f).slice(1);
		let fname = path.basename(f).slice(0, -ext.length - 1);
		if (EXT_TO_CMD[ext] === undefined) {
			if (IGNORED_EXTS.includes(ext)) continue;
			// TODO: Error Handling
			debug("Error Handling for Testing isn't implemented yet");
			debugInfo(JSON.stringify({ f, ext }, null, 2), 1);
			failExit(1);
		} else {
			let success = true;

			if (typeof EXT_TO_CMD[ext].pre === 'function') {
				if ((await runCommand(EXT_TO_CMD[ext].pre(fname), f, name, ext)) === null) {
					success = false;
				}
			}

			for (let i = 0; success && i < inputs.length; i++) {
				const input = inputs[i];
				const output = outputs[i];

				let cmd = EXT_TO_CMD[ext].run(input, fname);

				let res = await runCommand(cmd, f, name, ext, input);
				if (res) {
					if (output.trim() !== res.stdout.trim()) {
						success = false;
						fail(`${path.basename(f)} didn't produce the expected output:`);
						failInfo('Input:', 1);
						failInfo(`${input}`, 2);
						failInfo(`Expected:`, 1);
						failInfo(output, 2);
						failInfo(`Received:`, 1);
						failInfo(res.stdout, 2);
					}
				} else {
					success = false;
				}
			}

			if (success) {
				succ(`${path.basename(f)} ran successfully`);
			}
		}
	}
}

function parseArgWithVal(i, args, name) {
	let a = args[i].split('=');
	if (a.length == 1) {
		if (i + 1 == args.length) {
			fail(`The command line option "${name}" requires arguments to be given after an "=".\nSee "-help" for more information on how to use the option correctly.`);
			failExit(1);
		}
		let next = args[++i];
		if (next.startsWith('-')) {
			fail(`The command line option "${name}" requires arguments to be given after an "=".\nSee "-help" for more information on how to use the option correctly.`);
			failExit(1);
		}
		if (next == '=') {
			if (i + 1 == args.length) {
				fail(`The command line option "${name}" requires arguments to be given after an "=".\nSee "-help" for more information on how to use the option correctly.`);
				failExit(1);
			}
			next = args[++i];
		} else if (next.startsWith('=')) next = next.slice(1);
		return { i, res: next.split(',') };
	} else {
		return { i, res: a[1].split(',') };
	}
}

async function main() {
	const args = process.argv.slice(2);
	const flags = {
		allTests: false,
		allLangs: false,
		problems: [],
		langs: [],
		dirs: [],
		rec: false,
		help: false,
	};
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg == 'all') flags.allTests = true;
		else if (arg == '-h' || arg == '--help') flags.help = true;
		else if (arg == '-r' || arg == '--record') flags.rec = true;
		else if (arg.startsWith('-d')) {
			let o = parseArgWithVal(i, args, '-d');
			flags.dirs = o.res;
			i = o.i;
		} else if (arg.startsWith('-l')) {
			let o = parseArgWithVal(i, args, '-l');
			flags.langs = o.res;
			i = o.i;
		} else {
			flags.problems.push(arg);
		}
	}

	if (flags.help) {
		console.log(HELP_TEXT);
		exit(0);
	}

	flags.problems = flags.problems.map((p) => p.toLowerCase());
	if (flags.problems.length === 0 && !flags.allTests) {
		warn('No Problems were provided, so all will be executed. This behavior might change in the future');
		flags.allTests = true;
	}
	flags.langs = flags.langs.map((l) => {
		if (l.startsWith('.')) l = l.slice(1);
		return l.toLowerCase();
	});
	if (flags.langs.length === 0) flags.allLangs = true;
	if (flags.dirs.length === 0) flags.dirs = ['./'];

	let jsons = flags.dirs.flatMap((d) => getTestJsons(path.join(__dirname, d)));
	// console.log({ flags });
	let toTest = getProblemFiles(jsons, flags.langs, flags.problems, flags.allTests, flags.allLangs);
	for await (const t of toTest) {
		await test(t.name, t.files, t.inputs, t.outputs, flags.rec);
	}
}

main();
