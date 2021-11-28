var gulp          = require('gulp'),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync').create(),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	notify        = require("gulp-notify"),
	rsync         = require('gulp-rsync'),
	merge 		  = require('merge-stream'),
	babel 		  = require('gulp-babel'),
	imagemin 	  = require('gulp-image'),
	cache = require('gulp-cached');
	pretty = require('gulp-plugin-prettier');
	const eslint = require('gulp-eslint');



gulp.task('styles', function() {
	return gulp.src('sass/**/*.sass')
	.pipe(merge())
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(concat('style.css'))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('imgs', function() {
	return gulp.src('img/**/*.{png, webp}')
	.pipe(cache(imagemin({
		progressive: true,
		pngquant: true,
		optipng: false,
		zopflipng: true,
		jpegRecompress: false,
		mozjpeg: true,
		gifsicle: true,
		svgo: true,
		concurrent: 20,
		quiet: true // defaults to false
	  })))
	.pipe(gulp.dest('build/img'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('jScripts', function() {
	return gulp.src('js/slider.js')
	.pipe(concat('slider.js'))
	.pipe(babel({
		presets: ['@babel/env']
	  }))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('build/js'))
	.pipe(browserSync.reload({ stream: true }))
});

// gulp.task('rsync', function() {
// 	return gulp.src('build/**')
// 	.pipe(rsync({
// 		root: 'build/',
// 		//hostname: 'username@yousite.com',
// 		//destination: 'yousite/public_html/',
// 		// include: ['*.htaccess'], // Includes files to deploy
// 		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
// 		recursive: true,
// 		archive: true,
// 		silent: false,
// 		compress: true
// 	}))
// });

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: 'build/'
		},
		port: 3000,
		notify: false,
	});

	gulp.watch('js/slider.js', gulp.series('jScripts'));
	gulp.watch('sass/**/*.sass', gulp.series('styles'));
    gulp.watch('build/*.html').on('change',browserSync.reload);
	gulp.watch('img/**/*.{png,webp}', gulp.series('imgs'));
});

gulp.task('default', gulp.parallel('browser-sync', 'jScripts', 'imgs'));
// gulp.task('default', gulp.parallel('browser-sync', 'jScripts'));
