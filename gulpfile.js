var gulp = require('gulp')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var cleanCSS = require('gulp-clean-css')
var pug = require('gulp-pug')
var notify = require('gulp-notify')
var browserSync = require('browser-sync').create()
var minimist = require('minimist')
var plumber = require('gulp-plumber')
var csscomb = require('gulp-csscomb')
var cached = require('gulp-cached')

var base = minimist(process.argv.slice(2)).base

gulp.task('browser-sync', function() {
  browserSync.init({
      port: 3000,
      // proxy: 'http://localhost:3000',
      files: ['./**/*.*'],
      browser: "google chrome",
      server: {
          baseDir: base,
          index: "index.html"
      },
      reloadDelay: 1000,
      reloadOnRestart: true,
      startPath: './index.html'
  });
});

gulp.task('reload', function(done) {
  browserSync.reload()
  done()
})

gulp.task('sass', function() {
  return gulp.src(base + '/sass/index.sass')
    .pipe(cached('sass'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    // .pipe(cleanCSS())
    .pipe(gulp.dest(base))
    .pipe(notify({
      title: 'Sass compiled.',
      message: new Date(),
      sound: 'Pop',
      icon: './assets/icon_sass.png'
    }))
})

gulp.task('pug', function() {
  return gulp.src(base + '/pug/index.pug')
    .pipe(plumber())
    .pipe(cached('pug'))
    .pipe(pug())
    .pipe(gulp.dest(base))
    .pipe(notify({
      title: 'Pug compiled.',
      message: new Date(),
      sound: 'Pop',
      icon: './assets/icon_pug.png'
    }))
})

gulp.task('csscomb', function() {
  return gulp.src(base + '/sass/*.sass')
    .pipe(csscomb())
    .pipe(gulp.dest(base + '/sass-dest'))
})

gulp.task('default', gulp.parallel('browser-sync',
    function() {
      gulp.watch(base + '/sass/*.sass', gulp.series('sass', 'reload'))
      gulp.watch(base + '/pug/*.pug', gulp.series('pug', 'reload'))
    }
  )
)
