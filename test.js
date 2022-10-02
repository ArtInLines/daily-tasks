const fs = require('fs');
const path = require('path');
const process = require('process');

class MyErr extends Error {
	constructor(msg) {
		super(msg);
	}
	print() {
		console.log('ERROR:');
		console.log(this.message);
	}
}

/**
 *
 * @param  {...String} s
 * @returns {String}
 */
function getDName(...s) {
	let dname = s.join('_').toLowerCase();
	let dir = fs.readdirSync(__dirname, { withFileTypes: true }).find((d) => {
		return d.isDirectory() && d.name.toLowerCase() === dname.toLowerCase();
	});
	if (!dir) throw new MyErr(`Directory ${dname} couldn't be found`);
	return dir.name;
}

/**
 *
 * @param {String} dpath
 * @returns {String}
 */
function getFNameFromDName(dname) {
	let files = fs
		.readdirSync(path.join(__dirname, dname), { withFileTypes: true })
		.filter((d) => d.isFile() && d.name.toLowerCase().endsWith('.js'))
		.map((d) => d.name);
	let r = new RegExp(`^(${dname}|main|master)`, 'i');
	let file = '';
	for (let fname of files) {
		if (r.test(fname)) file = fname;
		else if (!file) file = fname;
	}
	if (!file) throw new MyErr(`Couldn't find a JavaScript file in the directory '${dname}'`);
	return file;
}

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
		throw new MyErr(`Module '${fpath}' couldn't be found`);
	}
	let f = null;
	let r = new RegExp(`^(${dname}|main|master|run)`);
	let funcs = Object.keys(mod).filter((k) => typeof mod[k] === 'function');
	for (let func of funcs) {
		if (r.test(func)) f = mod[func];
		else if (!f) f = mod[func];
	}
	if (!f) throw new MyErr(`No applicable function was found in the module: '${fpath}'\nFunctions: [${funcs.join(', ')}]`);
	return f;
}

/**
 *
 * @param {String} dname
 * @return {Object[]}
 */
function readTestFile(dname) {
	let testFile = fs
		.readdirSync(path.join(__dirname, dname), { withFileTypes: true })
		.find((d) => d.isFile() && d.name.toLowerCase().endsWith('.json') && (d.name.toLowerCase().startsWith('example') || d.name.toLowerCase().startsWith('test')))?.name;
	if (!testFile) throw new MyErr(`No test-file (.json) was found in './${dname}'`);
	return JSON.parse(fs.readFileSync(path.join(__dirname, dname, testFile))).map((t) => getInputOutput(t, testFile, dname));
}

/**
 *
 * @param {*} test
 * @param {String} tfile
 * @param {String} dir
 * @returns {Object}
 */
function getInputOutput(test, tfile, dir) {
	if (Array.isArray(test)) {
		return { in: test[0], out: test[1] };
	} else if (typeof test === 'object') return test;
	else throw new MyErr(`Each test should be stored as a list or map in the test-file '${tfile}' in the directory '${dir}'`);
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @returns {Boolean}
 */
function cmpOutput(x, y) {
	if (Array.isArray(x)) {
		if (x.length !== y.length) return false;
		for (let i = 0; i < x.length; i++) {
			if (!cmpOutput(x[i], y[i])) return false;
		}
		return true;
	} else if (typeof x == 'object') {
		let xKeys = Object.keys(x);
		if (xKeys.length !== Object.keys(y).length) return false;
		for (let k in xKeys) {
			if (!y.hasOwnProperty(k) || !cmpOutput(x[k], y[k])) {
				return false;
			}
		}
		return true;
	} else return x === y;
}

/**
 *
 * @param {function} f
 * @param {Object[]} tests
 * @returns {?Array}
 */
function runTests(f, tests) {
	for (let t of tests) {
		let res = f(t['in']);
		if (!cmpOutput(res, t['out'])) return [res, t];
	}
	return null;
}

/**
 *
 * @param {function} f
 * @param {Object[]} tests
 * @param {String} taskName
 */
function runTestsWithPrint(f, tests, taskName) {
	let res = runTests(f, tests);
	if (res === null) {
		console.log(`All tests passed for task '${taskName}'`);
	} else {
		console.log(`TEST FAILED\nInput: ${res[1]['in']}\nExpected Output: ${res[1]['out']}\nActual Output: ${res[0]}`);
	}
}

try {
	let dname = getDName(process.argv.slice(2));
	let fname = getFNameFromDName(dname);
	let f = getFuncFromFPath(dname, fname);
	let tests = readTestFile(dname);
	runTestsWithPrint(f, tests, dname);
} catch (e) {
	if (e instanceof MyErr) e.print();
	else throw e;
}
