const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', 'src/');
const build = path.resolve(__dirname, '..', 'build/');

const logger = (type, task, message, log) => {
	const chalk = require('chalk');
	console[type](chalk[type === 'info' ? 'bgGreen' : 'bgRed'](` ${task} `), message);
	if (log) console[type](log);
};

const format = (filepath) => {
	const prettier = require('prettier');
	fs.writeFileSync(
		filepath,
		prettier.format(fs.readFileSync(filepath, 'utf8'), {
			filepath,
			semi: true,
			useTabs: true,
			tabWidth: 4,
			bracketSpacing: true,
			bracketSameLine: false,
			singleQuote: true
		})
	);
};

const css = async () => {
	const postcss = require('postcss');
	const autoprefixer = require('autoprefixer');
	const vars = require('postcss-simple-vars');
	const nested = require('postcss-nested');
	const mixins = require('postcss-mixins');

	const from = path.join(src, 'style.pcss');
	const to = path.join(build, 'style.css');

	await postcss([autoprefixer, vars, mixins, nested])
		.process(fs.readFileSync(from), { from, to })
		.then((result) => {
			fs.mkdirSync(path.dirname(to), { recursive: true });
			fs.writeFileSync(to, result.css);
			format(to);
			if (result.map) fs.writeFileSync(to + '.map', result.map.toString());
		});
};

const html = async () => {
	const { Liquid } = require('liquidjs');
	const fg = require('fast-glob');

	const liquid = new Liquid({ root: src, extname: '.liquid' });
	const data = { influencers: fg.sync([`influencers/*.liquid`], { cwd: src }) };

	await liquid.renderFile('index', data).then((html) => {
		const to = path.join(build, 'index.html');
		fs.mkdirSync(path.dirname(to), { recursive: true });
		fs.writeFileSync(to, html);
		format(to);
	});
};

html()
	.catch((e) => logger('error', 'HTML', 'Build failed', e))
	.then(() => logger('info', 'HTML', 'Build successful'));
css()
	.catch((e) => logger('error', 'CSS', 'Build failed', e))
	.then(() => logger('info', 'CSS', 'Build successful'));
