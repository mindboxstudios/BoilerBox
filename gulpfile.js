var gulp   = require('gulp');
var gutil  = require('gulp-util');
var clean  = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass   = require('gulp-sass');
var watch  = require('gulp-watch');
var connect = require('gulp-connect');

var paths = {
    html:    ['./src/**/*.html'],
    scripts: ['./src/js/**/*.js'],
    styles:  ['./src/sass/**/*.scss'],
    images:  ['./src/img/**/*']
};

// Clean bower_components in dist/lib/
gulp.task('clean:components', function(){
    return gulp.src(['dist/lib/'], {read:false})
        .pipe(clean());
});

// Clean dist/img/
gulp.task('clean:images', function(){
    return gulp.src(['dist/img/'], {read:false})
        .pipe(clean());
});

// Clean dist/js/
gulp.task('clean:js', function(){
    return gulp.src(['dist/js/'], {read:false})
        .pipe(clean());
});

// Clean dist/css/
gulp.task('clean:css', function(){
    return gulp.src(['dist/css/'], {read:false})
        .pipe(clean());
});

// move bower components to dist/lib
gulp.task('components', function(){
    gulp.src(['./bower_components/**/*'])
        .pipe(gulp.dest('dist/lib'));
});

// Copy images to dist/img/
gulp.task('images', ['clean:images'], function(){
    gulp.src(['./src/img/**/*'])
        .pipe(gulp.dest('dist/img'))
        .pipe(connect.reload());
});

// Uglify, concat, and copy js to dist/js/
gulp.task('scripts', ['clean:js'], function() {
    return gulp.src(paths.scripts)
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});

// Compile sass, compress output, and copy to dist/css/
gulp.task('styles', ['clean:css'], function() {
    return gulp.src(paths.styles)
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

// Copy all html to dist/
gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

// Copy everything from src except uncompiled sass and js
gulp.task('dist', function(){
    return gulp.src([
        './src/**/*',
        '!./src/sass/**/*',
        '!./src/js/**/*'
    ])
        .pipe(gulp.dest('dist'));
});

// Start server, livereload in dist/ as root
gulp.task('connect', function() {
    connect.server({
        root: './dist/',
        livereload: true
    });
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    watch(paths.html, function() {
        gulp.start('html', 'dist');
    });

    watch(paths.scripts, function() {
        gulp.start('scripts', 'dist');
    });

    watch(paths.styles, function() {
        gulp.start('styles', 'dist');
    });

    watch(paths.images, function() {
        gulp.start('images', 'dist');
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
    'dist',
    'components',
    'images',
    'scripts',
    'styles',
    'html',
    'connect',
    'watch'
]);
