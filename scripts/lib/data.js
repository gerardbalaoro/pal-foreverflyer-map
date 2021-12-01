const { readFileSync } = require('fs');
const { basename, extname, join } = require('path');
const fg = require('fast-glob');
const yaml = require('js-yaml');
const assign = require('assign-deep');
const merge = require('merge-deep');

const dataDirectory = 'src/data';
const loadYaml = (f) => yaml.load(readFileSync(join(dataDirectory, f), 'utf8'));
exports.development = {
	...fg
		.sync(['*.yml', '!production.yml'], { cwd: dataDirectory })
		.map((file, i) => {
			const key = basename(file, extname(file));
			return { [key]: loadYaml(file) };
		})
		.reduce((a, v) => ({ ...a, ...v })),
	influencers: fg.sync([`influencers/*.yml`], { cwd: dataDirectory }).map((file, i) => {
		return loadYaml(file);
	})
};

exports.production = (() => {
	const o = loadYaml('production.yml');
	const d = merge({}, exports.development);
	assign(d.config, o.config);
	for (const influencer of d.influencers) {
		assign(influencer, o.influencers[influencer.instagram] || {});
	}

	return d;
})();
