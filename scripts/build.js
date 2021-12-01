const { development } = require('./lib/data');
const compiler = require('./lib/compiler');

compiler(
	[
		{ in: 'src/styles/index.pcss', out: 'build/map.css' },
		{ in: 'src/index.liquid', out: 'build/index.html' }
	],
	development
);