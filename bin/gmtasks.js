#!/usr/bin/env node

process.stdout.write("gunmetal v1.3.2\r");
process.env.GULP_PROJECTS_DIR = process.cwd();
process.chdir(require('@dsinisa/gunmetal').dirname);
require('gulp-cli')();
