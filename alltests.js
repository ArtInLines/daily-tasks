const process = require('process');
const { spawn } = require('child_process');
const { readFileSync, readdirSync } = require('fs');

const languages = JSON.parse(readFileSync('./languages.json', { encoding: 'utf8' }));
const argv = process.argv.slice(2);
const filesInDir = readdirSync(argv[0], { withFileTypes: true })
	.filter((d) => d.isFile())
	.map((d) => d.name);
runTests();

async function runTests(idx = 0) {
	if (idx >= languages.length) return;

	let lang = languages[idx];
	if (!filesInDir.some((f) => lang['endings'].some((ending) => new RegExp('.' + ending + '$', 'i').test(f)))) {
		return runTests(idx + 1);
	} else {
		const s = spawn(lang['cmd'], [lang['test'], ...argv]);
		console.log(`\nRunning test in ${lang['name']}...`);

		s.stdout.on('data', (chunk) => {
			console.log(String(chunk));
		});

		s.stderr.on('data', (chunk) => {
			console.log(String(chunk));
		});

		return new Promise((resolve, reject) => {
			s.on('close', () => {
				runTests(idx + 1).then(resolve);
			});

			s.on('error', (err) => {
				reject(err);
			});
		});
	}
}
