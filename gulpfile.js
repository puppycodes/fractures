const gulp = require("gulp")
const postcss = require("gulp-postcss")
const postcssimport = require("postcss-import")
const postcsscssnext = require("postcss-cssnext")
const nano = require("gulp-cssnano")
const rename = require("gulp-rename")
const gzip = require("gulp-gzip")
const size = require("gulp-size")
const stylelint = require("gulp-stylelint")

let files = ["./src/fractures.css"]
let postcssVanilla = [postcssimport(), postcsscssnext({ browsers: [""] })]
let postcssAutoprefix = [postcssimport(), postcsscssnext({ browsers: ["last 2 versions"] })]

// Build
gulp.task("build", ["default", "build: vanilla", "build: autoprefixed"])

// Build only fractures.css
gulp.task("default", () => {
	return gulp
		.src(files)
		.pipe(postcss(postcssVanilla))
		.pipe(gulp.dest("./dist"))
		.pipe(size({ showFiles: true }))
})

// Build without autoprefixing
gulp.task("build: vanilla", () => {
	return gulp
		.src(files)
		.pipe(postcss(postcssVanilla))
		.pipe(nano())
		.pipe(rename("fractures.min.css"))
		.pipe(gulp.dest("./dist"))
		.pipe(size({ showFiles: true }))
		.pipe(gzip())
		.pipe(rename("fractures.min.css.gz"))
		.pipe(gulp.dest("./dist"))
		.pipe(size({ showFiles: true, gzip: true }))
})

// Build autoprefixed version
gulp.task("build: autoprefixed", () => {
	return gulp
		.src(files)
		.pipe(postcss(postcssAutoprefix))
		.pipe(nano())
		.pipe(rename("fractures.prefixed.min.css"))
		.pipe(gulp.dest("./dist"))
		.pipe(size({ showFiles: true }))
		.pipe(gzip())
		.pipe(rename("fractures.prefixed.min.css.gz"))
		.pipe(gulp.dest("./dist"))
		.pipe(size({ showFiles: true, gzip: true }))
})

// Lint
gulp.task("lint", ["default"], () => {
	return gulp.src("./dist/fractures.css").pipe(
		stylelint({
			reporters: [{ formatter: "string", console: true }]
		})
	)
})

// Report csslint after a build
gulp.task("test", ["lint"])

// Watch for css changes
gulp.task("watch", () => {
	return gulp.watch("./src/*.css", ["default"])
})
