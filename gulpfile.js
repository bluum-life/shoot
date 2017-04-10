const gulp = require('gulp');
const rollup = require('rollup');
const pug = require('gulp-pug');

const pugConfig = {
	pageTitle: 'blüüm'
};

gulp.task('html', () => gulp.src('./src/*.pug')
	.pipe(pug({
		data: pugConfig
	}))
	.pipe(gulp.dest('bin'))
);

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

gulp.task('build', ['js', 'html']);
