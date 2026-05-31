const meta = {
  id: 'prim',
  name: 'Prim最小生成树',
  nameEn: "Prim's Minimum Spanning Tree",
  difficulty: 'medium',
  category: 'graph',
  tags: ['最小生成树', 'Prim', '贪心', 'MST'],
  timeComplexity: 'O(V^2) / O((V+E) log V)',
  spaceComplexity: 'O(V)',
  description: 'Prim算法是一种用于在加权连通图中查找最小生成树（MST）的贪心算法。它从任意一个节点开始，每次都选择连接已在树中的节点和不在树中的节点的最小权重边，将新节点加入树中。',
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
    label: '图: Prim最小生成树算法'
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
    adj[edge.to].push({ to: edge.from, weight: edge.weight });
  }

  const INF = Infinity;
  const inMST = new Set();
  const key = {};
  const parent = {};
  const mstEdges = [];

  for (const id of nodeIds) {
    key[id] = INF;
    parent[id] = null;
  }
  key['A'] = 0;

  // Step 1: 初始化
  yield {
    data: { type: 'graph', value: graph },
    highlights: { nodeIds: ['A'], edgeIds: [], visitedNodeIds: ['A'], queueNodeIds: [] },
    variables: { key: { ...key }, parent: { ...parent }, inMST: [], mstEdges: [] },
    description: '初始化Prim算法：从节点A开始，key[A]=0，其余节点key值为∞。'
  };

  while (inMST.size < nodeIds.length) {
    // 找到key值最小的不在MST中的节点
    let u = null;
    let minKey = INF;
    for (const id of nodeIds) {
      if (!inMST.has(id) && key[id] < minKey) {
        minKey = key[id];
        u = id;
      }
    }

    if (u === null) break;
    inMST.add(u);

    if (parent[u] !== null) {
      mstEdges.push(`${parent[u]}->${u}`);
    }

    yield {
      data: { type: 'graph', value: graph },
      highlights: {
        nodeIds: [u],
        edgeIds: mstEdges,
        visitedNodeIds: Array.from(inMST),
        queueNodeIds: nodeIds.filter(id => !inMST.has(id))
      },
      variables: { key: { ...key }, parent: { ...parent }, inMST: Array.from(inMST), mstEdges: [...mstEdges], selectedNode: u },
      description: `将节点 ${u}${parent[u] ? `（通过边 ${parent[u]}->${u}）` : ''} 加入最小生成树。`
    };

    // 更新邻居的key值
    for (const neighbor of adj[u] || []) {
      if (!inMST.has(neighbor.to) && neighbor.weight < key[neighbor.to]) {
        const oldKey = key[neighbor.to];
        key[neighbor.to] = neighbor.weight;
        parent[neighbor.to] = u;

        yield {
          data: { type: 'graph', value: graph },
          highlights: {
            nodeIds: [u, neighbor.to],
            edgeIds: mstEdges,
            visitedNodeIds: Array.from(inMST),
            queueNodeIds: nodeIds.filter(id => !inMST.has(id))
          },
          variables: {
            key: { ...key },
            parent: { ...parent },
            inMST: Array.from(inMST),
            mstEdges: [...mstEdges],
            u,
            neighbor: neighbor.to,
            edgeWeight: neighbor.weight,
            oldKey: oldKey === INF ? '∞' : oldKey
          },
          description: `更新边 ${u}->${neighbor.to}（权重=${neighbor.weight}）：key[${neighbor.to}] 从 ${oldKey === INF ? '∞' : oldKey} 更新为 ${neighbor.weight}。`
        };
      }
    }
  }

  const totalWeight = mstEdges.reduce((sum, e) => {
    const [from, to] = e.split('->');
    const edge = graph.edges.find(ed => ed.from === from && ed.to === to) ||
                 graph.edges.find(ed => ed.from === to && ed.to === from);
    return sum + (edge ? edge.weight : 0);
  }, 0);

  yield {
    data: { type: 'graph', value: graph },
    highlights: {
      nodeIds: nodeIds,
      edgeIds: mstEdges,
      visitedNodeIds: nodeIds,
      queueNodeIds: []
    },
    variables: { key: { ...key }, parent: { ...parent }, inMST: nodeIds, mstEdges: [...mstEdges], totalWeight },
    description: `Prim算法完成！最小生成树包含边: ${mstEdges.join(', ')}，总权重=${totalWeight}。`
  };
}

const code = [
  'function prim(graph, start) {',
  '  const inMST = new Set();',
  '  const key = {}, parent = {};',
  '  const nodes = Object.keys(graph);',
  '',
  '  for (const node of nodes) {',
  '    key[node] = Infinity;',
  '    parent[node] = null;',
  '  }',
  '  key[start] = 0;',
  '',
  '  while (inMST.size < nodes.length) {',
  '    let u = null, minKey = Infinity;',
  '    for (const node of nodes) {',
  '      if (!inMST.has(node) && key[node] < minKey) {',
  '        minKey = key[node]; u = node;',
  '      }',
  '    }',
  '    inMST.add(u);',
  '',
  '    for (const [v, weight] of Object.entries(graph[u])) {',
  '      if (!inMST.has(v) && weight < key[v]) {',
  '        key[v] = weight;',
  '        parent[v] = u;',
  '      }',
  '    }',
  '  }',
  '',
  '  return { parent, key };',
  '}'
];

module.exports = { meta, steps, code };
