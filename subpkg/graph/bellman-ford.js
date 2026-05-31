const meta = {
  id: 'bellman-ford',
  name: 'Bellman-Ford最短路径',
  nameEn: 'Bellman-Ford Algorithm',
  difficulty: 'medium',
  category: 'graph',
  tags: ['最短路径', 'Bellman-Ford', '动态规划', '负权边'],
  timeComplexity: 'O(V * E)',
  spaceComplexity: 'O(V)',
  description: 'Bellman-Ford算法用于在带权图中计算单源最短路径，与Dijkstra不同，它可以处理负权边。算法通过对所有边进行|V|-1次松弛操作来逐步逼近最短路径，然后通过第|V|次迭代检测负权环。',
  defaultInput: {
    type: 'graph',
    value: {
      nodes: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' },
        { id: 'D', label: 'D' },
        { id: 'E', label: 'E' }
      ],
      edges: [
        { from: 'A', to: 'B', weight: -1 },
        { from: 'A', to: 'C', weight: 4 },
        { from: 'B', to: 'C', weight: 3 },
        { from: 'B', to: 'D', weight: 2 },
        { from: 'B', to: 'E', weight: 2 },
        { from: 'D', to: 'B', weight: 1 },
        { from: 'D', to: 'C', weight: 5 },
        { from: 'E', to: 'D', weight: -3 }
      ]
    },
    label: '图: Bellman-Ford算法（包含负权边）'
  }
};

function* steps(input) {
  const graph = JSON.parse(JSON.stringify(input));
  const nodeIds = graph.nodes.map(n => n.id);
  const edges = graph.edges;

  const INF = Infinity;
  const dist = {};
  const prev = {};

  for (const id of nodeIds) {
    dist[id] = INF;
    prev[id] = null;
  }
  dist['A'] = 0;

  // Step 1: 初始化
  yield {
    data: { type: 'graph', value: graph },
    highlights: { nodeIds: ['A'], edgeIds: [], visitedNodeIds: ['A'], queueNodeIds: [] },
    variables: { dist: { ...dist }, prev: { ...prev }, iteration: 0, phase: 'init' },
    description: `初始化距离数组：dist[A]=0，其余节点距离为∞。需要进行 ${nodeIds.length - 1} 次松弛迭代。`
  };

  const V = nodeIds.length;

  // |V|-1 次松弛
  for (let i = 1; i <= V - 1; i++) {
    let updated = false;

    yield {
      data: { type: 'graph', value: graph },
      highlights: { nodeIds: [], edgeIds: [], visitedNodeIds: [], queueNodeIds: [] },
      variables: { dist: { ...dist }, prev: { ...prev }, iteration: i, phase: 'iteration_start' },
      description: `第 ${i}/${V - 1} 轮松弛：遍历所有边，尝试松弛。`
    };

    for (const edge of edges) {
      const edgeId = `${edge.from}->${edge.to}`;
      if (dist[edge.from] !== INF) {
        const newDist = dist[edge.from] + edge.weight;
        if (newDist < dist[edge.to]) {
          const oldDist = dist[edge.to];
          dist[edge.to] = newDist;
          prev[edge.to] = edge.from;
          updated = true;

          yield {
            data: { type: 'graph', value: graph },
            highlights: {
              nodeIds: [edge.from, edge.to],
              edgeIds: [edgeId],
              visitedNodeIds: nodeIds.filter(id => dist[id] !== INF),
              queueNodeIds: []
            },
            variables: {
              dist: { ...dist },
              prev: { ...prev },
              iteration: i,
              edge: edgeId,
              weight: edge.weight,
              oldDist: oldDist === INF ? '∞' : oldDist,
              newDist,
              updated: true
            },
            description: `松弛边 ${edgeId}（权重=${edge.weight}）：dist[${edge.from}]=${dist[edge.from] - edge.weight} + ${edge.weight} = ${newDist} < ${oldDist === INF ? '∞' : oldDist}，更新 dist[${edge.to}]=${newDist}。`
          };
        } else {
          yield {
            data: { type: 'graph', value: graph },
            highlights: {
              nodeIds: [edge.from, edge.to],
              edgeIds: [edgeId],
              visitedNodeIds: nodeIds.filter(id => dist[id] !== INF),
              queueNodeIds: []
            },
            variables: {
              dist: { ...dist },
              prev: { ...prev },
              iteration: i,
              edge: edgeId,
              weight: edge.weight,
              oldDist: dist[edge.to] === INF ? '∞' : dist[edge.to],
              newDist,
              updated: false
            },
            description: `检查边 ${edgeId}：${dist[edge.from]} + ${edge.weight} = ${newDist} >= ${dist[edge.to]}，无需更新。`
          };
        }
      }
    }

    if (!updated) {
      yield {
        data: { type: 'graph', value: graph },
        highlights: {
          nodeIds: nodeIds.filter(id => dist[id] !== INF),
          edgeIds: [],
          visitedNodeIds: nodeIds.filter(id => dist[id] !== INF),
          queueNodeIds: []
        },
        variables: { dist: { ...dist }, prev: { ...prev }, iteration: i, earlyTermination: true },
        description: `第 ${i} 轮没有发生任何更新，提前终止。`
      };
      break;
    }
  }

  // 检测负权环
  let hasNegativeCycle = false;
  for (const edge of edges) {
    if (dist[edge.from] !== INF && dist[edge.from] + edge.weight < dist[edge.to]) {
      hasNegativeCycle = true;
      break;
    }
  }

  // 构建路径
  const paths = {};
  for (const id of nodeIds) {
    if (dist[id] !== INF) {
      const path = [];
      let curr = id;
      while (curr !== null) {
        path.unshift(curr);
        curr = prev[curr];
      }
      paths[id] = path;
    }
  }

  yield {
    data: { type: 'graph', value: graph },
    highlights: {
      nodeIds: hasNegativeCycle ? [] : nodeIds,
      edgeIds: [],
      visitedNodeIds: hasNegativeCycle ? [] : nodeIds.filter(id => dist[id] !== INF),
      queueNodeIds: []
    },
    variables: {
      dist: { ...dist },
      prev: { ...prev },
      paths,
      hasNegativeCycle,
      complete: true
    },
    description: hasNegativeCycle
      ? '检测到负权环！图中存在负权环，无法计算最短路径。'
      : `Bellman-Ford完成！从A到各节点的最短距离: ${Object.entries(dist).map(([k, v]) => `${k}:${v}`).join(', ')}`
  };
}

const code = [
  'function bellmanFord(graph, start) {',
  '  const dist = {}, prev = {};',
  '  const nodes = Object.keys(graph);',
  '',
  '  for (const node of nodes) {',
  '    dist[node] = Infinity;',
  '    prev[node] = null;',
  '  }',
  '  dist[start] = 0;',
  '',
  '  for (let i = 1; i < nodes.length; i++) {',
  '    for (const [u, v, w] of graph.edges) {',
  '      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {',
  '        dist[v] = dist[u] + w;',
  '        prev[v] = u;',
  '      }',
  '    }',
  '  }',
  '',
  '  for (const [u, v, w] of graph.edges) {',
  '    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {',
  '      return { dist: null, error: "负权环" };',
  '    }',
  '  }',
  '',
  '  return { dist, prev };',
  '}'
];

module.exports = { meta, steps, code };
