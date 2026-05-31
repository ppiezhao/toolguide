const meta = {
  id: 'bfs',
  name: '广度优先搜索',
  nameEn: 'Breadth-First Search',
  difficulty: 'easy',
  category: 'graph',
  tags: ['BFS', '图遍历', '队列'],
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  description: '广度优先搜索（BFS）是一种用于遍历或搜索树或图的算法。它从根节点开始，沿着树的宽度遍历所有节点，即先访问同一层的所有节点，再访问下一层。BFS通常使用队列来实现。',
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
    label: '图: BFS从A开始遍历'
  }
};

function* steps(input) {
  const graph = JSON.parse(JSON.stringify(input));
  const visited = new Set();
  const queue = [];
  const visitOrder = [];

  // 构建邻接表
  const adj = {};
  for (const node of graph.nodes) {
    adj[node.id] = [];
  }
  for (const edge of graph.edges) {
    adj[edge.from].push({ to: edge.to, weight: edge.weight });
  }

  // Step 1: 初始化 - 从A开始
  yield {
    data: { type: 'graph', value: graph },
    highlights: { nodeIds: [], edgeIds: [], visitedNodeIds: [], queueNodeIds: ['A'] },
    variables: { queue: ['A'], visited: [], current: null },
    description: '初始化BFS：从节点A开始，将A加入队列。'
  };

  queue.push('A');
  visited.add('A');

  while (queue.length > 0) {
    const current = queue.shift();
    visitOrder.push(current);

    // 标记当前节点为已访问
    yield {
      data: { type: 'graph', value: graph },
      highlights: {
        nodeIds: [current],
        edgeIds: [],
        visitedNodeIds: Array.from(visited),
        queueNodeIds: queue
      },
      variables: { queue: [...queue], visited: Array.from(visited), current },
      description: `访问节点 ${current}，将其标记为已访问。`
    };

    // 遍历邻居
    for (const neighbor of adj[current] || []) {
      if (!visited.has(neighbor.to)) {
        visited.add(neighbor.to);
        queue.push(neighbor.to);

        yield {
          data: { type: 'graph', value: graph },
          highlights: {
            nodeIds: [current, neighbor.to],
            edgeIds: [`${current}->${neighbor.to}`],
            visitedNodeIds: Array.from(visited),
            queueNodeIds: queue
          },
          variables: { queue: [...queue], visited: Array.from(visited), current, edge: `${current}->${neighbor.to}` },
          description: `从节点 ${current} 探索到邻居节点 ${neighbor.to}，将其加入队列。`
        };
      }
    }
  }

  // 最终结果
  yield {
    data: { type: 'graph', value: graph },
    highlights: {
      nodeIds: [],
      edgeIds: [],
      visitedNodeIds: Array.from(visited),
      queueNodeIds: []
    },
    variables: { queue: [], visited: Array.from(visited), current: null, visitOrder },
    description: `BFS遍历完成！访问顺序: ${visitOrder.join(' -> ')}`
  };
}

const code = [
  'function bfs(graph, start) {',
  '  const visited = new Set();',
  '  const queue = [start];',
  '  visited.add(start);',
  '',
  '  while (queue.length > 0) {',
  '    const node = queue.shift();',
  '    console.log(`访问节点: ${node}`);',
  '',
  '    for (const neighbor of graph[node]) {',
  '      if (!visited.has(neighbor)) {',
  '        visited.add(neighbor);',
  '        queue.push(neighbor);',
  '      }',
  '    }',
  '  }',
  '',
  '  return Array.from(visited);',
  '}'
];

module.exports = { meta, steps, code };
