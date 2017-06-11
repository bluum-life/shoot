const gulp = require('gulp');
const rollup = require('rollup');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const uglify = require('rollup-plugin-uglify');
const minify = require('uglify-js-harmony').minify;

const pugConfig = {
	pageTitle: 'blüüm'
};

gulp.task('html', () => gulp.src('./src/*.pug')
	.pipe(pug({
		data: pugConfig,
	}))
	.pipe(rename({
		extname: '.htm',
	}))
	.pipe(gulp.dest('bin'))
);

const writeBundle = (bundle) =>
	bundle.write({
		format: '',
		moduleName: 'shoot',
		dest: './bin/shoot.js',
		sourceMap: false,
	});

gulp.task('js', () => rollup.rollup({
	entry: './src/index.js',
}).then(writeBundle));

gulp.task('js-min', () => rollup.rollup({
	entry: './src/index.js',
	plugins: [
		uglify({}, minify)
	]
}).then(writeBundle));

gulp.task('build', ['js', 'html']);

gulp.task('compile', ['js-min', 'html']);

gulp.task('watch', () => {
	gulp.watch('src/**/*', ['build']);
})

gulp.task('default', ['watch', 'build']);
