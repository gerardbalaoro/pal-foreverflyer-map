const fs = require('fs');
const path = require('path');

const logger = (type, task, message, log) => {
	const chalk = require('chalk');
	console[type](chalk[type === 'info' ? 'bgBlue' : 'bgRed'](` ${task} `), message);
	if (log) console[type](log);
};

const format = (filepath, code) => {
	const prettier = require('prettier');
	return prettier.format(code, {
		filepath,
		semi: true,
		useTabs: true,
		printWidth: 120,
		tabWidth: 4,
		bracketSpacing: true,
		bracketSameLine: false,
		singleQuote: true
	});
};

const css = async (src, dest) => {
	const postcss = require('postcss');
	const atImport = require('postcss-easy-import');
	const autoprefixer = require('autoprefixer');
	const vars = require('postcss-simple-vars');
	const nested = require('postcss-nested');
	const mixins = require('postcss-mixins');

	const from = path.join(src, 'styles/index.pcss');
	const to = path.join(dest, 'style.css');

	await postcss([atImport, mixins, vars, nested, autoprefixer])
		.process(fs.readFileSync(from), { from, to })
		.then((result) => {
			fs.mkdirSync(path.dirname(to), { recursive: true });
			fs.writeFileSync(to, format(to, result.css));
			if (result.map) fs.writeFileSync(to + '.map', result.map.toString());
		});
};

const html = async (src, dest) => {
	const { Liquid } = require('liquidjs');
	const fg = require('fast-glob');
	const yaml = require('js-yaml');

	const liquid = new Liquid({ root: src, extname: '.liquid' });
	const data = {
		influencers: fg
			.sync([`influencers/*.yml`], { cwd: src })
			.map((i) => yaml.load(fs.readFileSync(path.join(src, i), 'utf8')))
	};

	await liquid.renderFile('index', data).then((html) => {
		const to = path.join(dest, 'index.html');
		fs.mkdirSync(path.dirname(to), { recursive: true });
		fs.writeFileSync(to, format(to, html));
	});
};

const src = path.join(__dirname, '..', 'src/');
const dest = path.join(__dirname, '..', 'build/');

html(src, dest)
	.catch((e) => logger('error', 'HTML', 'Build failed', e))
	.then(() => logger('info', 'HTML', 'Build successful'));
css(src, dest)
	.catch((e) => logger('error', 'CSS', 'Build failed', e))
	.then(() => logger('info', 'CSS', 'Build successful'));
