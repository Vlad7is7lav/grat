var gulp          = require('gulp'),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	notify        = require("gulp-notify"),
	rsync         = require('gulp-rsync');
	imagemin = require('gulp-imagemin')



gulp.task('styles', function() {
	return gulp.src(['node_modules/bootstrap-4.1.3/scss/bootstrap.scss', 'sass/**/*.sass'])
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.stream())
});

gulp.task('imgs', function() {
	return gulp.src('build/img/index/*.png')
	.pipe(imagemin())
	.pipe(gulp.dest('build/img/index'))
	.pipe(browserSync.stream())
});

gulp.task('jScripts', function() {
	return gulp.src([
		'build/libs/jquery/jquery-3.3.1.min.js',
		'build/js/*.js'
		])
	.pipe(concat('scripts.min.js')) // At the end
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('build/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('rsync', function() {
	return gulp.src('build/**')
	.pipe(rsync({
		root: 'build/',
		//hostname: 'username@yousite.com',
		//destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'build/'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('watch', ['styles', 'jScripts', 'browser-sync'], function() {
	gulp.watch('sass/**/*.sass', ['styles']);
	gulp.watch(['build/libs/**/*.js', 'build/js/*.js'], ['jScripts']);
	gulp.watch('build/img/index/*.png', ['imgs']);
	gulp.watch('build/*.html', browserSync.reload)
});

gulp.task('default', ['watch']);
