const path = require('path');
const fs = require('fs');

const buildDir = 'static';

const copyWasmFiles = (
	startPath = path.resolve(__dirname),
	extension = 'wasm'
) => {
	if (!fs.existsSync(startPath)) {
		console.log('no dir ', startPath);
		return;
	}

	const files = fs.readdirSync(startPath);
	for (let i = 0; i < files.length; i++) {
		const filename = path.join(startPath, files[i]);
		const stat = fs.lstatSync(filename);
		if (stat.isDirectory()) {
			copyWasmFiles(filename, extension); //recurse
		} else if (filename.endsWith(`.${extension}`)) {
			fs.copyFile(filename, `${buildDir}/${files[i]}`, (err) => {
				if (err) {
					console.log('no dir ', buildDir);
					return;
				}
				console.log(`${files[i]} was copied to ${buildDir}/${files[i]}`);
			});
		}
	}
};

copyWasmFiles();
