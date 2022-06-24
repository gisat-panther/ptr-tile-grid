import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';

const env = process.env.NODE_ENV;
const pkg = require('./package.json');

const CWD = process.cwd();
const Paths = {
	SRC: `${CWD}/src`,
	DIST: `${CWD}/dist`,
	NODE_MODULES: `${CWD}/node_modules`,
};
Object.assign(Paths, {
	INPUT: Paths.SRC + '/index.js',
	OUTPUT: Paths.DIST + '/index.js',
});

const lodashExternal = ['lodash/isArray', 'lodash/isFinite', 'lodash/without'];

export default {
	input: 'src/index.js',
	external: [
		...lodashExternal,
		'@gisatcz/ptr-utils',
		'@gisatcz/ptr-core',
		/@babel\/runtime/,
	],
	output: {
		file: {
			es: 'dist/index.es.js',
			cjs: pkg.main,
		}[env],
		format: env,
		globals: {
			// 'lodash/random': '_.random'
		},
		exports: 'named' /** Disable warning for default imports */,
		sourcemap: true,
	},
	plugins: [
		babel({
			plugins: ['lodash'],
			babelHelpers: 'runtime',
		}),
		commonjs({
			include: 'node_modules/**',
		}),
		filesize(),
		// TODO figure out dev and prod version
		// alias({
		//   entries: [
		//     { find: '@gisatcz/cross-package-react-context', replacement: 'C:/Users/pvlach/DATA/cross-package-react-context' }
		//   ]
		// })
	],
};
