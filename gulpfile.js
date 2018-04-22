
const browserSync = require('browser-sync').create();
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleancss     = require('gulp-clean-css');

const gulp = require('gulp');
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const run  = require('gulp-run');

const siteRoot = '_site';
const cssFiles = '_assets/css/**/*.?(s)css';
const jsFiles = 'js/**/*.js';

var spawn = require('cross-spawn');


gulp.task('css', () => {
  gulp.src(cssFiles)
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(cleancss())
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('_site/css'))
    .on('error', gutil.log);
});

gulp.task('js', function() {
  return gulp.src([
      jsFiles
  ])
      .pipe(gulp.dest(siteRoot+'/js'))
      .on('error', gutil.log);
});

gulp.task('jekyll', function() {
  var shellCommand = 'bundle exec jekyll build --incremental';

  return gulp.src('')
      .pipe(run(shellCommand))
      .on('error', gutil.log);
});
/*gulp.task('jekyll', () => {
  var child = spawn('jekyll', ['build', '--incremental'], { stdio: 'inherit' });
});*/

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(cssFiles, ['css']);
  gulp.watch(jsFiles, ['js']);

  //rebuild site if these files change
  gulp.watch('./_data/**/*',['jekyll']);
  gulp.watch('./_includes/**/*',['jekyll']);
  gulp.watch('./_layouts/**/*',['jekyll']);
  gulp.watch('./_plugins/**/*',['jekyll']);
  gulp.watch('./data/**/*',['jekyll']);
  gulp.watch('./img/**/*',['jekyll']);
  gulp.watch('./_posts/**/*',['jekyll']);

});

gulp.task('default', ['css', 'jekyll', 'serve']);