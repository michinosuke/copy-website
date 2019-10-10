// Usage 
// `apple.com`というサブディレクトリで作業する場合
// gulp --base apple.com
// ルートディレクトリで作業する場合
// gulp --base .

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
var changedInPlace = require('gulp-changed-in-place')
var wait = require('gulp-wait')
var changed = require('gulp-changed')

var base = process.argv.length === 4
  ? 'docs/' + minimist(process.argv.slice(2)).base + '/'
  : 'docs/'

var path = {
  sass: {
    dir: base + 'sass',
    index: base + 'sass/index.sass',
    all: base + 'sass/*.sass',
    tmp: {
      dir: base + 'sass/tmp',
      all: base + 'sass/tmp/*.sass'
    }
  },
  pug: {
    dir: base + 'pug',
    index: base + 'pug/index.pug',
    all: base + 'pug/*.pug'
  }
}

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
      startPath: 'index.html'
  });
});

gulp.task('reload', function(done) {
  browserSync.reload()
  done()
})

gulp.task('sass', function() {
  return gulp.src(path.sass.index)
    .pipe(cached('sass'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    // .pipe(cleanCSS())
    .pipe(gulp.dest(base))
    .pipe(notify({
      title: 'Sass compiled.',
      message: new Date(),
      sound: 'Pop',
      icon: './notify-icon/icon_sass.png'
    }))
})

gulp.task('pug', function() {
  return gulp.src(path.pug.index)
    .pipe(plumber())
    .pipe(cached('pug'))
    .pipe(pug())
    .pipe(gulp.dest(base))
    .pipe(notify({
      title: 'Pug compiled.',
      message: new Date(),
      sound: 'Pop',
      icon: './notify-icon/icon_pug.png'
    }))
})

gulp.task('csscomb', function() {
  return gulp.src(path.sass.all)
    .pipe(csscomb())
    .pipe(gulp.dest(path.sass.tmp.dir))
})

gulp.task('moveSassTmpToSrc', function() {
  return gulp.src(path.sass.tmp.all)
    .pipe(changed(path.sass.dir))
    .pipe(gulp.dest(path.sass.dir))
})

gulp.task('default', gulp.parallel('browser-sync', ['sass'], ['pug'], function() {
    gulp.watch(path.sass.all, gulp.series('sass', 'reload', 'csscomb'))
    gulp.watch(path.sass.tmp.all, gulp.series('moveSassTmpToSrc'))
    gulp.watch(path.pug.all, gulp.series('pug', 'reload'))
  }
))
