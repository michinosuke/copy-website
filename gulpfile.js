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

var base = minimist(process.argv.slice(2)).base

var src = {
  dir: base,
  sass: {
    dir: base + '/sass',
    index: base + '/sass/index.sass',
    all: base + '/sass/*.sass'
  },
  pug: {
    dir: base + '/pug',
    index: base + '/pug/index.pug',
    all: base + '/pug/*.pug'
  }
}

var tmp = {
  dir: base + '/tmp',
  sass: {
    dir: base + '/tmp/sass',
    all: base + '/tmp/sass/*.sass'
  },
  pug: {
    dir: base + '/tmp/pug',
    all: base + '/tmp/pug/*.pug'
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
      startPath: './index.html'
  });
});

gulp.task('reload', function(done) {
  browserSync.reload()
  done()
})

gulp.task('sass', function() {
  return gulp.src(src.sass.index)
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
  return gulp.src(src.pug.index)
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
  return gulp.src(src.sass.all)
    .pipe(csscomb())
    .pipe(gulp.dest(tmp.sass.dir))
})

gulp.task('moveSassTmpToSrc', function() {
  return gulp.src(tmp.sass.all)
    .pipe(changed(src.sass.dir))
    .pipe(gulp.dest(src.sass.dir))
})

gulp.task('default', gulp.parallel('browser-sync', function() {
    gulp.watch(src.sass.all, gulp.series('sass', 'reload', 'csscomb'))
    gulp.watch(tmp.sass.all, gulp.series('moveSassTmpToSrc'))
    gulp.watch(src.pug.all, gulp.series('pug', 'reload'))
  }
))
