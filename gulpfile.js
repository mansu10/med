// 引入 gulp
var gulp = require('gulp');

// 引入组件
var ngAnnotate = require('ng-annotate');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var browserSync = require('browser-sync').create();

var paths = {
    script: './src/js'
}


// 合并，压缩文件
gulp.task('scripts', function() {
    gulp.src(['./src/js/service/*.js', './src/js/directives/*.js', './src/js/filter/*.js', './src/js/controller/*.js'])
        .pipe(ngAnnotate())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});
gulp.task('libs', function() {
    gulp.src('./lib/**/*.js')
        .pipe(ngAnnotate())
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
})
gulp.task('connect', function() {
    connect.server({
        port: 1300,
        livereload: true
    });
});
gulp.task('watch', function() {
    gulp.watch('./js/**/*.js',['scripts']);
})
    // 默认任务
gulp.task('default', ['watch','scripts', 'connect']);
