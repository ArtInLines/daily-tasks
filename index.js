const fs = require('fs');

async function main(fname = 'index.js', path = './', scriptName = 'startAll') {
	const rootDir = await fs.promises.opendir(path);
	const package = JSON.parse(fs.readFileSync('./package.json'));
	package.scripts[scriptName] = '';
	for await (const rootDirent of rootDir) {
		if (!rootDirent.isDirectory()) continue;
		const dir = await fs.promises.opendir(path + '/' + rootDirent.name);
		let foundAFile = false;
		for await (const dirent of dir) {
			if (dirent.name !== fname || !dirent.isFile()) continue;
			package.scripts[rootDirent.name] = `node ${rootDirent.name}/${fname}`;
			foundAFile = true;
		}
		if (!foundAFile) continue;
		if (package.scripts[scriptName] !== '') package.scripts[scriptName] += ' && ';
		package.scripts[scriptName] += `echo "${rootDirent.name}" && npm run ${rootDirent.name}`;
	}
	fs.writeFileSync('./package.json', JSON.stringify(package, null, '	'));
}

main();
