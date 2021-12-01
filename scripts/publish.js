const { production } = require('./lib/data');
const compiler = require('./lib/compiler');

compiler(
	[
		{ in: 'src/styles/index.pcss', out: 'publish/map.css' },
		{ in: 'src/container.liquid', out: 'publish/map.html' }
	],
	production
);
