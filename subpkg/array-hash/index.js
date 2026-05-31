/**
 * 数组与哈希子包聚合器
 *
 * 汇总所有数组/哈希算法模块，供列表页和播放页使用。
 * 每个模块导出 { meta, steps, code }。
 */

const algorithms = [
  require('./two-sum'),
  require('./three-sum'),
  require('./valid-parentheses'),
  require('./max-subarray'),
  require('./sliding-window-max'),
  require('./two-pointers'),
  require('./merge-intervals'),
  require('./lru-cache'),
  require('./best-time-stock'),
  require('./product-except-self'),
  require('./find-duplicate'),
  require('./missing-number'),
  require('./majority-element'),
  require('./rotate-array'),
  require('./container-water'),
  require('./group-anagrams'),
  require('./longest-consecutive'),
  require('./subarray-sum'),
  require('./top-k-frequent'),
  require('./trapping-rain-water'),
  require('./next-greater'),
  require('./daily-temperatures'),
  require('./min-stack'),
  require('./lfu-cache'),
  require('./largest-rectangle'),
  require('./find-median')
];

module.exports = algorithms;
