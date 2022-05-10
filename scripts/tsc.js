const { series } = require('gulp');
const del = require('del');
const { execOut } = require('./utils');

function cleanOutput () {
  return del(['../packages/common/lib', '../packages/core/lib', '../packages/scripts/lib'], { force: true });
}

exports.default = series(
  cleanOutput,
  series(
    () => execOut('tsc', { cwd: '../packages/common' }),
    () => execOut('tsc', { cwd: '../packages/core' }),
    () => execOut('tsc', { cwd: '../packages/scripts' })
  )
);