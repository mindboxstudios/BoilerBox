var gulp   = require('gulp');
var gutil  = require('gulp-util');
var clean  = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass   = require('gulp-sass');
var connect = require('gulp-connect');

var paths = {
    html:    ['./**/*.html'],
    scripts: ['src/js/**/*.js'],
    styles:  ['src/sass/main.scss'],
    images:  ['src/img/**/*']
};

// clean bower components
gulp.task('clean:components', function(){
    return gulp.src(['dist/lib/'], {read:false})
        .pipe(clean());
});

// clean images
gulp.task('clean:images', function(){
    return gulp.src(['dist/img/'], {read:false})
        .pipe(clean());
});

//
gulp.task('components', ['clean:components'], function(){
    gulp.src([
        './bower_components/**/*'
    ])
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('images', ['clean:images'], function(){
    gulp.src([
        './src/img/**/*'
    ])
        .pipe(gulp.dest('dist/img'))
        .pipe(connect.reload());;
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());;
});

gulp.task('styles', function() {
    return gulp.src(paths.styles)
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());;
});

gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(connect.reload());;
});

gulp.task('connect', function() {
    connect.server({
        root: './',
        livereload: true
    });
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
    'components',
    'images',
    'scripts',
    'styles',
    'connect',
    'watch'
]);
