

var path = require('path');
var metalsmith_task = require('@dsinisa/gulp-metalsmith-server').metalsmith_task;
var shopify_task = require('@dsinisa/gulp-metalsmith-server').shopify_task;

// copy layouts to build
gulp.task('layouts:copy', function() {
    var srcDir = path.join(gulp.config.projectDir, gulp.config.roots.src, gulp.config.srcRoots.layouts);
    var dstDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.layouts);
    var source;
    if (gulp.config.layouts.engine == 'pug')
        source = srcDir + '/**/*.pug';
    else
        source = srcDir + '/**/*.jade';

    return gulp.src(source).pipe(gulp.dest(dstDir));
});

var msFunc = function(cb) {
    metalsmith_task.build(path.join(gulp.config.projectDir, gulp.config.roots.build), gulp.config.layouts.metalsmith, function (err, result) {
        if (err) {
            console.log(err);
        }

        cb();
    });
};

gulp.task('layouts:metalsmith',msFunc);
gulp.task('layouts:ms', msFunc);

gulp.task('layouts:shopify', function(cb) {
    shopify_task.run(path.join(gulp.config.projectDir, gulp.config.roots.build), gulp.config.layouts.shopify, cb);
});

var jadeFunc = function(plugin, filter, options) {
    var srcDir = path.join(gulp.config.projectDir, gulp.config.roots.build, gulp.config.srcRoots.layouts);
    var dstDir = path.join(gulp.config.projectDir, gulp.config.roots.build);
    var source;
    if (gulp.config.layouts.engine == 'pug')
        source = srcDir + '/**/*.pug';
    else
        source = srcDir + '/**/*.jade';

    var re = new RegExp(filter, 'i');

    return gulp.src(source)
        .pipe(gulp.plugins.filterBy(function(file) {
            return !re.test(file.path);
        }))
        //.pipe(gulp.plugins.print())
        .pipe(plugin(options))
        .pipe(gulp.dest(dstDir));
};

gulp.task('layouts:jade', function() {
    return jadeFunc(gulp.plugins.jade, gulp.config.layouts.jade.filter, gulp.config.layouts.jade.options);
});

gulp.task('layouts:pug', function() {
    return jadeFunc(gulp.plugins.pug, gulp.config.layouts.pug.filter, gulp.config.layouts.pug.options);
});

gulp.task('layouts:jadephp', function() {
    return jadeFunc(gulp.plugins.jadePhp, gulp.config.layouts.jadephp.filter, gulp.config.layouts.jadephp.options);
});


gulp.task('layouts:htmlsplit', function() {
    var srcDir = path.join(gulp.config.projectDir, gulp.config.roots.build);
    var source = srcDir + gulp.config.layouts.htmlsplit.src;

    return gulp.src(source)
        //.pipe(gulp.plugins.debug())
        .pipe(gulp.plugins.htmlsplit(gulp.config.layouts.htmlsplit.options))
        //.pipe(gulp.plugins.debug())
        .pipe(gulp.dest(srcDir));
});

gulp.task('layouts:processhtml', function() {
    var srcDir = path.join(gulp.config.projectDir, gulp.config.roots.build);
    var source = srcDir + gulp.config.layouts.processhtml.src;

    return gulp.src(source)
        //.pipe(gulp.plugins.debug())
        .pipe(gulp.plugins.processhtml(gulp.config.layouts.processhtml.options))
        //.pipe(gulp.plugins.debug())
        //.pipe(gulp.plugins.processhtml())
        //.pipe(gulp.plugins.debug())
        .pipe(gulp.dest(srcDir));
});


gulp.task('layouts', gulp.series('layouts:' + gulp.config.layouts.engine, 'layouts:shopify', 'layouts:processhtml', 'layouts:htmlsplit'));
