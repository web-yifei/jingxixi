//要想使用gulp提供的功能，首先要将gulp引入到当前文件中
const cuijn_gulp = require('gulp');

//gulp是一个基于task的构建工具，我们需要在执行构建步骤时，先创建任务
// cuijn_gulp.task('任务名称',回调函数)

async function testTask() {
    console.log("测试环境配置是否成功")

}

cuijn_gulp.task('test', testTask);

async function copyIndex() {
    cuijn_gulp.src('./src/index.html').pipe(cuijn_gulp.dest('./dist'))
}
cuijn_gulp.task('copy-index', copyIndex);

async function copyHtml() {
    cuijn_gulp.src("./src/html/*.html").pipe(cuijn_gulp.dest('./dist/html'))
}
cuijn_gulp.task('copy-html', copyHtml);

async function copyImg() {
    //路径中的**,代表将文件夹下的路径解构，整体拷贝走
    cuijn_gulp.src('./scr/assets/img/**/*.{jpg,gif,png}').pipe(cuijn_gulp.dest('./dist/assets/img'))
}
cuijn_gulp.task('copy-img', copyImg);

async function copyLib() {
    cuijn_gulp.src('./src/lib/**/*.*').pipe(cuijn_gulp.dest('./dist/lib'));
}
cuijn_gulp.task('copy-lib', copyLib);

//cuijn_gulp.parallel()返回一个新函数，该新函数会并行的执行被合并的任务
var copyAll = cuijn_gulp.parallel(copyIndex, copyHtml, copyImg, copyLib);
cuijn_gulp.task('copy', copyAll);

//编译sass这件事，gulp自己是无法实现的，需要依赖插件
//gulp-sass gulp-sass要使用node-sass来编译scss文件
//使用插件的步骤：
//  1.安装插件【npm install gulp-sass node-sass】
//  2.将插件引入到gulpfile.js中
var sass = require('gulp-sass');
async function sassTask() {
    cuijn_gulp.src('./src/style/**/*.scss').pipe(sass({
        outputStyle: "compressed"
    })).pipe(cuijn_gulp.dest('./dist/css/'))
}
cuijn_gulp.task('sass', sassTask);
//  3.使用引入后的插件


const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
async function homeJS() {
    //将home下的所有js文件进行合并，之后再babel编译
    //合并需要使用插件gulp-concat  【npm i gulp-concat】
    cuijn_gulp.src('./src/js/home/**/*.js', {
        allowEmpty: true
    }).pipe(concat("home.js")).pipe(babel({
        presets: ['@babel/env']

    })).pipe(uglify())
    //编译到ES5后，要进行压缩
    //借助插件【npm i gulp-uglify】
    .pipe(cuijn_gulp.dest('./dist/js/home'))
}
//【npm install gulp-babel @babel/core @babel/preset-env】
cuijn_gulp.task('js-home', homeJS);

var dist = cuijn_gulp.series(clean,cuijn_gulp.parallel(homeJS,sassTask,copyAll));
cuijn_gulp.task('dist',dist);

const del = require('del');
//【npm i del】删除
function clean(){
    return del(['dist'])
}

function watch(){
    cuijn_gulp.watch('./src/index.html', copyIndex)
    cuijn_gulp.watch('./src/assets/img/**/*.{jpg,png,gif}', copyImg)
    cuijn_gulp.watch('./src/html/*.html', copyHtml)
    cuijn_gulp.watch('./src/lib/**/*.*', copyLib)
    cuijn_gulp.watch('./src/style/**/*.scss', sassTask)
    cuijn_gulp.watch('./src/js/**/*.js',homeJS)
}
cuijn_gulp.task('watch',watch);

const sprite = require('gulp.spritesmith')
//【精灵图】 npm i gulp.spritesmith
async function  spriteCreate(){
    cuijn_gulp.src('./src/assets/icons/**/*.png').pipe(sprite({
        imgName:"精灵图.png",
        cssName:"精灵图.css"
    })).pipe(cuijn_gulp.dest('./dist/assets/icons'))
}
cuijn_gulp.task('sprite',spriteCreate);