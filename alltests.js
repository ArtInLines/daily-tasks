const process = require('process');
const { spawn } = require('child_process');

const testScripts = [
	['py', './test.py'],
	['node', './test.js'],
];
const argv = process.argv.slice(2);
runScript(0, testScripts);

async function runScript(idx = 0, scripts = testScripts) {
	if (idx >= scripts.length) return;

	let script = scripts[idx];
	const s = spawn(script[0], [script[1], ...argv]);
	console.log(`\nRunning ${script[0]} script...`);
	s.stdout.on('data', (chunk) => {
		console.log(String(chunk));
	});
	s.stderr.on('data', (chunk) => {
		console.log(String(chunk));
	});
	return new Promise((resolve, reject) => {
		s.on('close', () => {
			runScript(idx + 1, scripts).then(resolve);
		});

		s.on('error', (err) => {
			reject(err);
		});
	});
}
