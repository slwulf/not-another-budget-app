// Config
var project = {
  name: 'budget',
  version: '0.0.2',
  paths: {
    src: {
      js: 'src/js/',
      css: 'src/css/',
      modules: {
        root: 'src/js/modules/',
        models: 'src/js/modules/models/'
      }
    },
    dist: {
      js: 'dist/',
      css: 'dist/',
      versions: 'dist/versions/'
    },
    lib: 'lib/',
    tests: 'tests/'
  }
};

var source = {
  // Module build order
  js: [
    project.paths.src.js + '_header.js',
    project.paths.src.modules.root + 'state.js',
    project.paths.src.modules.root + 'events.js',
    project.paths.src.modules.models + 'transactions.js',
    project.paths.src.modules.models + 'budget.js',
    // project.paths.src.modules.root + 'render.js',
    project.paths.src.js + '_footer.js'
  ],

  // I'm not actually sure if this will concat
  // with multiple stylesheets...
  css: [
    project.paths.src.css + 'budget.scss'
  ],

  // Build Mocha tests from source.js
  tests: function tests() {
    return this.js.filter(function(str) {
      // filter out non-modules
      return str.indexOf(project.paths.src.modules.root) > -1;
    })
    .concat([
      // add Mocha tests
      project.paths.tests + 'init.js',
      project.paths.tests + 'specs/*.js'
    ]);
  }
};

/**
 * Black box stuff ahead...
 */

// Init Gulp Modules
var
  gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  prefix = require('gulp-autoprefixer'),
  cssmin = require('gulp-cssmin'),
  run = require('run-sequence'),
  mocha = require('gulp-mocha');

/**
 * JavaScript Tasks
 */

gulp.task('lint', function(){
  return gulp.src([
    project.paths.dist.versions +
    project.version + '/' +
    project.name + '.js',

    project.paths.tests + 'specs/*.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function(){
  return gulp.src(source.js)
    .pipe(concat(project.name + '.js'))
    .pipe(gulp.dest(project.paths.dist.versions +
                    project.version + '/'));
});

gulp.task('js', ['scripts']);

gulp.task('jsRelease', function(){
  return gulp.src(project.paths.dist.versions +
                  project.version + '/' +
                  project.name + '.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(project.paths.dist.js));
});

/**
 * CSS Tasks
 */

gulp.task('css', function() {
  return gulp.src(source.css)
    .pipe(sass())
    .pipe(prefix('last 3 versions'))
    .pipe(rename({
      basename: project.name,
      extname: '.css'
    }))
    .pipe(gulp.dest(project.paths.dist.versions +
                    project.version + '/'));
});

gulp.task('cssRelease', function(){
  return gulp.src(project.paths.dist.versions +
                  project.version + '/' +
                  project.name + '.css')
    .pipe(cssmin())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(project.paths.dist.css));
});

/**
 * Tests
 */

// Nyancat reporter! Less output, used
// for dev builds
gulp.task('test', function(){
  return gulp.src(source.tests())
    .pipe(concat(project.name + '-tests.js'))
    .pipe(gulp.dest(project.paths.tests))
    .pipe(mocha({
      ui: 'bdd', // mochajs.org/#bdd
      reporter: 'nyan'
    }));
});

// Full test report. Verbose, used
// for release builds
gulp.task('test-spec', function(){
  return gulp.src(source.tests())
    .pipe(concat(project.name + '-tests.js'))
    .pipe(gulp.dest(project.paths.tests))
    .pipe(mocha({
      ui: 'bdd', // mochajs.org/#bdd
      reporter: 'spec'
    }));
});

/**
 * Build Tasks
 */

gulp.task('build', function(){
  run(
    'lint',
    'test',
    ['js', 'css']
  );
});

gulp.task('release', function(){
  run(
    ['js', 'css'],
    'test-spec',
    ['jsRelease', 'cssRelease']
  );
});

gulp.task('watch', function(){
    gulp.watch(source.js, ['test', 'js']);
    gulp.watch(project.paths.src + '**/*.scss', ['css']);
    gulp.watch(project.paths.tests + 'specs/*.js', ['test']);
    // gulp.watch('README.md', 'release');
});

// Default task
gulp.task('default', ['build', 'watch']);