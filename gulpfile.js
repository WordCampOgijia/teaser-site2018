/*----------------------------
 パッケージ読み込み
----------------------------*/
const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const browserSync = require('browser-sync').create();
const rewriteCSS = require('gulp-rewrite-css');
const plumber = require('gulp-plumber');
const pleeease = require('gulp-pleeease');
const csscomb = require('gulp-csscomb');
const imagemin = require("gulp-imagemin");
const autoprefixer =require('autoprefixer');
const postcss =require('gulp-postcss');
const cssmqpacker = require('css-mqpacker');
const cleanCSS = require('gulp-clean-css');

/*----------------------------
 初期設定
----------------------------*/
var theme_root_dir = './';
var css_dir = './css/';
var proxy = 'http://localhost/';

/*----------------------------
 開発用タスク
----------------------------*/

const processors = [
  autoprefixer({browsers: ['last 4 versions', 'ie >= 9', 'iOS >= 9', 'Android >= 4.4']}),
  cssmqpacker
];

// ローカルサーバー起動
gulp.task('server', function() {
	browserSync.init({
		files: [theme_root_dir],
		proxy: proxy,
		watchOptions: {
			ignoreInitial: true,
			ignored: [theme_root_dir + '**/*.scss', theme_root_dir + '.git/']
		}
	});
});

// SASSコンパイル・プリフィクス追加・並び替え
gulp.task('sass', function() {
	return sass('./' + 'scss/*.scss')
		.on('error', function (err) {
				console.error('Error!', err.message);
		})
		.pipe(plumber())
		.pipe(csscomb())
		.pipe(postcss(processors))
		.pipe(rewriteCSS({
    	destination:css_dir
    }))
		.pipe(gulp.dest(css_dir));
});

// 画像圧縮
gulp.task("minimg", function() {
	return gulp.src([theme_root_dir + 'images/*.jpg', theme_root_dir + 'images/*.png'])
		.pipe(imagemin())
		.pipe(gulp.dest(theme_root_dir + 'images/'));
});

//CSS圧縮
gulp.task('minify-css', function() {
    return gulp.src([theme_root_dir + 'css/*.css'])
        .pipe(cleanCSS())
        .pipe(gulp.dest(css_dir));
});

/*----------------------------
 監視用タスク
----------------------------*/
gulp.task('watch', function() {
	gulp.watch(theme_root_dir + '**/*.scss', ['sass']);
});

/*----------------------------
 タスク開始
----------------------------*/
gulp.task('default', ['server', 'watch']);
