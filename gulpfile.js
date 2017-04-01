const gulp = require('gulp');
const rollup = require('rollup');

gulp.task('js', () => rollup.rollup({
	entry: './src/index.js', 
}).then((bundle) => {
	bundle.write({
		format: '',
		moduleName: 'shoot',
		dest: './bin/shoot.js',
		sourceMap: false,
	});
}));

gulp.task('build', ['js']);
