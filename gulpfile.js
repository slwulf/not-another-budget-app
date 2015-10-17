/**
 * Registria Gulp Boilerplate
 *
 * Use this when starting a new project.
 * Don't forget to rename the project in
 * your pacakage.json!
 *
 * Set the variables below to customize
 * the setup for your project.
 */

// Config
var project = {
  name: 'budget',
  version: '0.0.1',
  paths: {
    src: {
      js: 'src/js/',
      css: 'src/css/'
    },
    dist: {
      js: 'dist/',
      css: 'dist/',
      versions: 'dist/versions/'
    },
    lib: 'lib/'
  }
};

var source = {
  // Include your scripts in order
  js: [
    project.paths.src.js + '_header.js',
    project.paths.src.js + 'modules/*',
    project.paths.src.js + '_footer.js'
  ],

  // Give each master Sass file a name
  // Ex: mySass: project.paths.src + 'css/mySass.scss'
  css: [
    project.paths.src.css + 'budget.scss'
  ]
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
  run = require('run-sequence');
  // run is for sync tasks that
  // will execute in a specific order:
    // gulp.task('whatevs', function() {
    //    run(
    //      'myTask',
    //      'myOtherTask'
    //    );
    // });

/**
 * JavaScript Tasks
 */

gulp.task('lint', function(){
  return gulp.src(project.paths.dist.versions +
                  project.version + '/' +
                  project.name + '.js')
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
    .pipe(gulp.dest(project.paths.dist.css))
});

/**
 * Build Tasks
 */

gulp.task('build', ['js', 'css']);

gulp.task('release', function(){
  run(
    'build',
    'lint',
    // TODO: should be a "tests" line here
    ['jsRelease', 'cssRelease']
  );
});

gulp.task('watch', function(){
    gulp.watch(source.js, ['js']);
    gulp.watch(project.paths.src + '**/*.scss', ['css']);
    // gulp.watch('README.md', 'release');
});

// Default task
gulp.task('default', ['build', 'watch']);