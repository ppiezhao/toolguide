/**
 * 动态规划子包聚合器
 *
 * 汇总所有 DP 算法模块，供列表页和播放页使用。
 * 每个模块导出 { meta, steps, code }。
 */

const algorithms = [
  require('./fibonacci'),
  require('./knapsack'),
  require('./lcs'),
  require('./lis'),
  require('./coin-change'),
  require('./edit-distance'),
  require('./climbing-stairs'),
  require('./lps'),
  require('./max-subarray-dp'),
  require('./word-break'),
  require('./unique-paths'),
  require('./min-path-sum'),
  require('./house-robber'),
  require('./longest-palindrome'),
  require('./jump-game')
];

module.exports = algorithms;
