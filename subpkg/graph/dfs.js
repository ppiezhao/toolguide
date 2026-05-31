const meta = {
  id: 'dfs',
  name: '深度优先搜索',
  nameEn: 'Depth-First Search',
  difficulty: 'easy',
  category: 'graph',
  tags: ['DFS', '图遍历', '栈', '递归'],
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  description: '深度优先搜索（DFS）是一种用于遍历或搜索树或图的算法。它从根节点开始，沿着一条路径尽可能深地探索，直到无法继续，然后回溯。DFS可以使用递归或显式栈来实现。',
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
    label: '图: DFS从A开始遍历'
  }
};

function* steps(input) {
  const graph = JSON.parse(JSON.stringify(input));
  const visited = new Set();
  const stack = [];
  const visitOrder = [];

  // 构建邻接表
  const adj = {};
  for (const node of graph.nodes) {
    adj[node.id] = [];
  }
  for (const edge of graph.edges) {
    adj[edge.from].push({ to: edge.to, weight: edge.weight });
  }

  // Step 1: 初始化
  yield {
    data: { type: 'graph', value: graph },
    highlights: { nodeIds: [], edgeIds: [], visitedNodeIds: [], queueNodeIds: ['A'] },
    variables: { stack: ['A'], visited: [], current: null, recursionDepth: 0 },
    description: '初始化DFS：从节点A开始，将其压入栈中。'
  };

  stack.push('A');

  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) continue;

    visited.add(current);
    visitOrder.push(current);

    yield {
      data: { type: 'graph', value: graph },
      highlights: {
        nodeIds: [current],
        edgeIds: [],
        visitedNodeIds: Array.from(visited),
        queueNodeIds: stack
      },
      variables: { stack: [...stack], visited: Array.from(visited), current, recursionDepth: stack.length },
      description: `访问节点 ${current}，标记为已访问。当前访问顺序: ${visitOrder.join(' -> ')}`
    };

    // 将未访问的邻居压入栈（反向入栈以保持自然顺序）
    const neighbors = adj[current] || [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      if (!visited.has(neighbor.to)) {
        stack.push(neighbor.to);

        yield {
          data: { type: 'graph', value: graph },
          highlights: {
            nodeIds: [current, neighbor.to],
            edgeIds: [`${current}->${neighbor.to}`],
            visitedNodeIds: Array.from(visited),
            queueNodeIds: stack
          },
          variables: { stack: [...stack], visited: Array.from(visited), current, edge: `${current}->${neighbor.to}`, recursionDepth: stack.length },
          description: `从节点 ${current} 发现邻居节点 ${neighbor.to}，将其压入栈中。`
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
    variables: { stack: [], visited: Array.from(visited), current: null, visitOrder, recursionDepth: 0 },
    description: `DFS遍历完成！访问顺序: ${visitOrder.join(' -> ')}`
  };
}

const code = [
  'function dfs(graph, start, visited = new Set()) {',
  '  visited.add(start);',
  '  console.log(`访问节点: ${start}`);',
  '',
  '  for (const neighbor of graph[start]) {',
  '    if (!visited.has(neighbor)) {',
  '      dfs(graph, neighbor, visited);',
  '    }',
  '  }',
  '',
  '  return Array.from(visited);',
  '}'
];

module.exports = { meta, steps, code };
