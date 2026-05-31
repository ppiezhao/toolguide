const meta = {
  id: 'dijkstra',
  name: 'Dijkstra最短路径',
  nameEn: "Dijkstra's Shortest Path",
  difficulty: 'medium',
  category: 'graph',
  tags: ['最短路径', 'Dijkstra', '贪心', '优先队列'],
  timeComplexity: 'O((V + E) log V)',
  spaceComplexity: 'O(V)',
  description: 'Dijkstra算法用于在带权图中找到单源最短路径。它使用贪心策略，每次选择距离源点最近且未处理过的节点，然后松弛其所有邻居的距离。该算法要求图中不存在负权边。',
  defaultInput: {
    type: 'graph',
    value: {
      nodes: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' },
        { id: 'D', label: 'D' },
        { id: 'E', label: 'E' },
        { id: 'F', label: 'F' }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'B', to: 'C', weight: 1 },
        { from: 'B', to: 'D', weight: 5 },
        { from: 'C', to: 'D', weight: 8 },
        { from: 'C', to: 'E', weight: 10 },
        { from: 'D', to: 'E', weight: 2 },
        { from: 'D', to: 'F', weight: 6 },
        { from: 'E', to: 'F', weight: 3 }
      ]
    },
    label: '图: Dijkstra从A到所有节点的最短路径'
  }
};

function* steps(input) {
  const graph = JSON.parse(JSON.stringify(input));
  const nodeIds = graph.nodes.map(n => n.id);

  // 构建邻接表
  const adj = {};
  for (const node of graph.nodes) {
    adj[node.id] = [];
  }
  for (const edge of graph.edges) {
    adj[edge.from].push({ to: edge.to, weight: edge.weight });
  }

  const INF = Infinity;
  const dist = {};
  const prev = {};
  const unvisited = new Set(nodeIds);

  for (const id of nodeIds) {
    dist[id] = INF;
    prev[id] = null;
  }
  dist['A'] = 0;

  // Step 1: 初始化
  yield {
    data: { type: 'graph', value: graph },
    highlights: { nodeIds: ['A'], edgeIds: [], visitedNodeIds: [], queueNodeIds: [] },
    variables: { dist: { ...dist }, prev: { ...prev }, unvisited: Array.from(unvisited), current: null },
    description: '初始化距离数组：dist[A]=0，其余节点距离为∞。'
  };

  while (unvisited.size > 0) {
    // 找到距离最小的未访问节点
    let current = null;
    let minDist = INF;
    for (const id of unvisited) {
      if (dist[id] < minDist) {
        minDist = dist[id];
        current = id;
      }
    }

    if (current === null || dist[current] === INF) break;

    unvisited.delete(current);
    const visitedNodes = nodeIds.filter(id => !unvisited.has(id));

    yield {
      data: { type: 'graph', value: graph },
      highlights: {
        nodeIds: [current],
        edgeIds: [],
        visitedNodeIds: visitedNodes,
        queueNodeIds: Array.from(unvisited)
      },
      variables: { dist: { ...dist }, prev: { ...prev }, current, unvisited: Array.from(unvisited), minDist },
      description: `选择当前距离最小的节点 ${current}，距离为 ${dist[current]}，标记为已处理。`
    };

    // 松弛邻居
    for (const neighbor of adj[current] || []) {
      const newDist = dist[current] + neighbor.weight;
      if (newDist < dist[neighbor.to]) {
        const oldDist = dist[neighbor.to];
        dist[neighbor.to] = newDist;
        prev[neighbor.to] = current;

        yield {
          data: { type: 'graph', value: graph },
          highlights: {
            nodeIds: [current, neighbor.to],
            edgeIds: [`${current}->${neighbor.to}`],
            visitedNodeIds: visitedNodes,
            queueNodeIds: Array.from(unvisited)
          },
          variables: {
            dist: { ...dist },
            prev: { ...prev },
            current,
            neighbor: neighbor.to,
            edgeWeight: neighbor.weight,
            oldDist: oldDist === INF ? '∞' : oldDist,
            newDist
          },
          description: `松弛边 ${current}->${neighbor.to}（权重=${neighbor.weight}）：距离从 ${oldDist === INF ? '∞' : oldDist} 更新为 ${newDist}。`
        };
      } else {
        yield {
          data: { type: 'graph', value: graph },
          highlights: {
            nodeIds: [current, neighbor.to],
            edgeIds: [`${current}->${neighbor.to}`],
            visitedNodeIds: visitedNodes,
            queueNodeIds: Array.from(unvisited)
          },
          variables: {
            dist: { ...dist },
            prev: { ...prev },
            current,
            neighbor: neighbor.to,
            edgeWeight: neighbor.weight,
            oldDist: dist[neighbor.to] === INF ? '∞' : dist[neighbor.to],
            newDist,
            relaxed: false
          },
          description: `检查边 ${current}->${neighbor.to}：${dist[current]} + ${neighbor.weight} = ${newDist} >= ${dist[neighbor.to]}，无需更新。`
        };
      }
    }
  }

  // 构建路径
  const paths = {};
  for (const id of nodeIds) {
    const path = [];
    let curr = id;
    while (curr !== null) {
      path.unshift(curr);
      curr = prev[curr];
    }
    paths[id] = path;
  }

  yield {
    data: { type: 'graph', value: graph },
    highlights: {
      nodeIds: nodeIds,
      edgeIds: graph.edges.map(e => `${e.from}->${e.to}`),
      visitedNodeIds: nodeIds,
      queueNodeIds: []
    },
    variables: { dist: { ...dist }, prev: { ...prev }, paths, complete: true },
    description: `Dijkstra算法完成！从A到各节点的最短距离: ${Object.entries(dist).map(([k, v]) => `${k}:${v}`).join(', ')}`
  };
}

const code = [
  'function dijkstra(graph, start) {',
  '  const dist = {}, prev = {};',
  '  const unvisited = new Set(Object.keys(graph));',
  '',
  '  for (const node of unvisited) {',
  '    dist[node] = Infinity;',
  '    prev[node] = null;',
  '  }',
  '  dist[start] = 0;',
  '',
  '  while (unvisited.size > 0) {',
  '    let current = null, minDist = Infinity;',
  '    for (const node of unvisited) {',
  '      if (dist[node] < minDist) {',
  '        minDist = dist[node];',
  '        current = node;',
  '      }',
  '    }',
  '    if (current === null) break;',
  '    unvisited.delete(current);',
  '',
  '    for (const [neighbor, weight] of Object.entries(graph[current])) {',
  '      const newDist = dist[current] + weight;',
  '      if (newDist < dist[neighbor]) {',
  '        dist[neighbor] = newDist;',
  '        prev[neighbor] = current;',
  '      }',
  '    }',
  '  }',
  '',
  '  return { dist, prev };',
  '}'
];

module.exports = { meta, steps, code };
