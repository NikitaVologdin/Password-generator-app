"use strict";
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync").create();
const pxToRem = require("gulp-pxtorem");

function catchErr(e) {
  console.log(e);
  this.emit("end");
}

const transpileSassToCss = (done) => {
  return gulp
    .src(`sass/style.sass`)
    .pipe(plumber())
    .pipe(sass({ errLogToConsole: true }))
    .on("error", catchErr)
    .pipe(gulp.dest(`css`))
    .pipe(browserSync.stream());
};

const concatCss = () => {
  return gulp
    .src(["css/*.css"])
    .pipe(plumber())
    .pipe(concat("style.css"))
    .pipe(browserSync.stream())
    .pipe(gulp.dest("css"));
};

const convertPixToRem = () => {
  return gulp
    .src(["css/style.css"])
    .pipe(plumber())
    .pipe(
      pxToRem({ propList: ["*"], mediaQuery: true, exclude: /node_modules/i })
    )
    .pipe(gulp.dest("css"));
};

function browser() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}

const watchFiles = () => {
  gulp.watch(
    ["sass/**/*.sass"],
    gulp.series(transpileSassToCss, concatCss, convertPixToRem)
  );
  gulp.watch(["./*.html"]).on("change", browserSync.reload);
};

exports.default = watchFiles;
