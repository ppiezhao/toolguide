/**
 * 查找子包聚合器
 *
 * 汇总所有查找算法模块，供列表页和播放页使用。
 * 每个模块导出 { meta, steps, code }。
 */

const algorithms = [
  require('./binary-search.js'),
  require('./linear-search.js'),
  require('./interpolation.js'),
  require('./exponential.js'),
  require('./jump.js'),
  require('./ternary.js')
];

module.exports = algorithms;
