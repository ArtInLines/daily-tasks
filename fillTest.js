const { readdirSync, writeFileSync } = require('fs');
const process = require('process');
const path = require('path');

const argv = process.argv.slice(2);
const dir = argv[0];

/**
 *
 * @param {String} fname
 * @returns {Function}
 */
function getFuncFromFPath(dname, fname) {
	let fpath = path.join(__dirname, dname, fname);
	let mod;
	try {
		mod = require(fpath);
	} catch (e) {
		throw new Error(`Module '${fpath}' couldn't be found`);
	}
	let f = null;
	let r = new RegExp(`^(${dname}|main|master|run)`);
	let funcs = Object.keys(mod).filter((k) => typeof mod[k] === 'function');
	for (let func of funcs) {
		if (r.test(func)) f = mod[func];
		else if (!f) f = mod[func];
	}
	if (!f) throw new Error(`No applicable function was found in the module: '${fpath}'\nFunctions: [${funcs.join(', ')}]`);
	return f;
}

const fname = readdirSync(dir, { withFileTypes: true }).find((d) => d.isFile() && d.name.endsWith('.js'))?.name;
const func = getFuncFromFPath(dir, fname);

const testfpath = path.join(dir, 'tests.json');
writeFileSync(
	testfpath,
	JSON.stringify(
		JSON.parse(require('fs').readFileSync(testfpath).toString()).map((test) => {
			let inp = test['in'];
			let res = Array.isArray(inp) ? func(...inp) : func(inp);
			return {
				in: test['in'],
				out: res,
			};
		}),
		null,
		4
	)
);
