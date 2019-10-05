var gulp = require('gulp')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var cleanCSS = require('gulp-clean-css')
var pug = require('gulp-pug')
var notify = require('gulp-notify')
var browserSync = require('browser-sync').create()
var minimist = require('minimist')

var argv = minimist(process.argv.slice(2)).base

gulp.task('browser-sync', function() {
  browserSync.init({
      port: 3000,
      // proxy: 'http://localhost:3000',
      files: ['./**/*.*'],
      browser: "google chrome",
      server: {
          baseDir: argv,
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
  return gulp.src(argv + '/sass/index.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest(argv))
    .pipe(notify({
      title: 'Sass compiled.',
      message: new Date(),
      sound: 'Pop',
      icon: './assets/icon_sass.png'
    }))
})

gulp.task('pug', function() {
  return gulp.src(argv + '/pug/index.pug')
    .pipe(pug())
    .pipe(gulp.dest(argv))
    .pipe(notify({
      title: 'Pug compiled.',
      message: new Date(),
      sound: 'Pop',
      icon: './assets/icon_pug.png'
    }))
})

gulp.task('default', gulp.parallel('browser-sync',
    function() {
      gulp.watch(argv + '/sass/*.sass', setTimeout(gulp.series('sass', 'reload'), 5000))
      gulp.watch(argv + '/pug/*.pug', setTimeout(gulp.series('pug', 'reload'), 5000))
    }
  )
)
