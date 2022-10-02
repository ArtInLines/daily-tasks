const process = require('process');
const fs = require('fs');
const path = require('path/posix');

const langs = new Set([['js', 'c', 'py', 'rb', 'pl', 'lsp']]);

function main() {
	const args = process.argv.slice(2);

	if (args.includes('-h') || args.includes('--help')) return help(args.filter((arg) => arg !== '-h' && arg !== '--help'));

	let i;
	i = args.findIndex((arg) => /^-*d(ir)+=/.test(arg));
	if (i === -1) return console.error('You need to specify a directory to test via the flag "--dir=DirectoyNumberOrName"');
	let dir = args[i].slice('=')[1];
	i = args.findIndex((arg) => /^-*l=/.test(arg));
	if (i == -1) return prepRun(dir, null);
	else return prepRun(dir, args[i]);
}

function prepRun(dir, l) {
	const dirs = fs.readdirSync(__dirname, { withFileTypes: true });
	dir = dirs.find((d) => d.isDirectory() && (d.name.startsWith(dir) || d.name.slice('. ').replace(' ', '_') === dir));
	if (dir === undefined) return console.error("The specified directory couldn't be found.");

	const examples = JSON.parse(fs.readFileSync(path.join(__dirname, dir.name, 'examples.json'), { encoding: 'utf-8' }));
	const files = fs.readdirSync(path.join(__dirname, dir.name), { withFileTypes: true }).filter((f) => f.isFile() && langs.has(path.extname(f.name).slice(1)));

	if (l) {
		const f = files.find((f) => f.name.endsWith('l'));
		if (!f) return console.error('No file of the specified language could be foun in the directory ' + dir.name);
		else return run(path.join(__dirname, dir.name, f.name), l, examples);
	}

	files.forEach((f) => run(path.join(__dirname, dir.name, f.name)), path.extname(f.name).slice(1), examples);
}

function run(fpath, l, examples) {
	// Somehow take the main function from the file
	// and execute it one after another with different inputs
}

main();
