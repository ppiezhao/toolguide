/**
 * 排序子包聚合器
 *
 * 汇总所有排序算法模块，供列表页和播放页使用。
 * 每个模块导出 { meta, steps, code }。
 */

const algorithms = [
  require('./bubble.js'),
  require('./selection.js'),
  require('./insertion.js'),
  require('./quick.js'),
  require('./merge.js'),
  require('./heap.js'),
  require('./shell.js'),
  require('./counting.js'),
  require('./radix.js'),
  require('./bucket.js'),
  require('./cocktail.js'),
  require('./gnome.js'),
  require('./tim.js')
];

module.exports = algorithms;
