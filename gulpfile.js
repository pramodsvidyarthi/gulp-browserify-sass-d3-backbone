var gulp = require('gulp'),
    server = require('gulp-server-livereload'),
    sass = require('gulp-sass'),
    uncss = require('gulp-uncss'),
    clean = require('gulp-clean'),
    browserify = require('gulp-browserify'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('serve', function() {
    gulp.src('')
        .pipe(server({
            defaultFile: './app/index.html',
            livereload: true,
            // directoryListing: true,
            open: true
        }));
});

gulp.task('scripts', function(){
    return gulp.src(['./app/scripts/main.js'], { read:false })
               .pipe(browserify({
                debug: true
               }))
               .pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('clean', function(){
  gulp.src(['./dist/images', './dist/stylesheets'], { read:false })
      .pipe(clean());
});

gulp.task('watch', function() {
    gulp.watch('./app/sass/**/*.scss', ['move']);
    gulp.watch('./app/index.html', ['move']);
    gulp.watch(['./app/scripts/**/*.js','./app/scripts/*.js'], ['scripts']);
});

gulp.task('move', ['clean','styles'] , function(){
    gulp.src('./app/images/*')
        .pipe(gulp.dest('./dist/images/'));
});

gulp.task('styles', function() {
    return gulp.src('./app/sass/*.scss')
        // .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true
        }))
        // .pipe(sourcemaps.write())
        .pipe(uncss({
            ignore:['.d3-tooltip','.d3-tooltip li','.d3-tooltip li span','.fa-square-o','.fa-circle-o','.fa-dot-circle-o', '.tasktypes', '.fa-check-square-o','.fa-angle-up'],
            html: ['./app/index.html'],
            timeout: 800
        }))
        .pipe(gulp.dest('./dist/stylesheets/'))
});

gulp.task('default', ['watch','move', 'scripts' ,'serve']);
