const fs = require('fs');
const path = require('path');

const logger = (type, task, message, log) => {
	const chalk = require('chalk');
	console[type](chalk[type === 'info' ? 'bgBlue' : 'bgRed'](` ${task} `), message);
	if (log) console[type](log);
};

const compiler = {
	async postcss(from, to, variables) {
		const postcss = require('postcss');
		const atImport = require('postcss-easy-import');
		const autoprefixer = require('autoprefixer');
		const vars = require('postcss-simple-vars');
		const nested = require('postcss-nested');
		const mixins = require('postcss-mixins');

		return postcss([atImport, mixins, vars({ variables }), nested, autoprefixer])
			.process(fs.readFileSync(from), { from, to })
			.then((result) => {
				fs.mkdirSync(path.dirname(to), { recursive: true });
				fs.writeFileSync(to, this.prettier(to, result.css));
				if (result.map) fs.writeFileSync(to + '.map', result.map.toString());
				logger('info', to, 'Build successful');
			})
			.catch((e) => logger('error', to, 'Build failed', e));
	},

	async liquid(src, dest, ctx) {
		const { Liquid } = require('liquidjs');
		const liquid = new Liquid({ root: path.dirname(src), extname: '.liquid' });

		return liquid
			.renderFile(path.basename(src), ctx)
			.then((html) => {
				fs.mkdirSync(path.dirname(dest), { recursive: true });
				fs.writeFileSync(dest, this.prettier(dest, html));
				logger('info', dest, 'Build successful');
			})
			.catch((e) => logger('error', dest, 'Build failed', e));
	},

	prettier(filepath, code) {
		const prettier = require('prettier');
		return prettier.format(code, {
			filepath,
			semi: true,
			useTabs: false,
			printWidth: 120,
			tabWidth: 2,
			bracketSpacing: true,
			bracketSameLine: false,
			singleQuote: true
		});
	}
};

module.exports = (tasks, data) => {
	return Promise.all(
		tasks.map((task) => {
			switch (path.extname(task.in)) {
				case '.pcss':
					return compiler.postcss(task.in, task.out, data.config);
				case '.liquid':
					return compiler.liquid(task.in, task.out, data);
			}
		})
	);
};
