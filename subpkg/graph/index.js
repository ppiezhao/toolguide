/**
 * 图子包聚合器
 *
 * 汇总所有图算法模块，供列表页和播放页使用。
 * 每个模块导出 { meta, steps, code }。
 */

const algorithms = [
  require('./bfs'),
  require('./dfs'),
  require('./dijkstra'),
  require('./prim'),
  require('./kruskal'),
  require('./topological'),
  require('./union-find'),
  require('./bellman-ford'),
  require('./floyd'),
  require('./bipartite'),
  require('./clone-graph'),
  require('./num-islands')
];

module.exports = algorithms;
