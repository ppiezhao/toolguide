const meta = {
  id: 'bipartite',
  name: '二分图检测',
  nameEn: 'Bipartite Graph Detection',
  difficulty: 'medium',
  category: 'graph',
  tags: ['二分图', 'BFS', '染色法', '图检测'],
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  description: '二分图检测算法用于判断一个图是否可以被二染色（即图中的节点能否被分为两个集合，使得每条边连接的两个节点属于不同集合）。常用的方法是BFS染色法，从起始节点开始，交替染色相邻节点。',
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
        { from: 'A', to: 'B', weight: 1 },
        { from: 'A', to: 'C', weight: 1 },
        { from: 'B', to: 'D', weight: 1 },
        { from: 'C', to: 'E', weight: 1 },
        { from: 'D', to: 'E', weight: 1 },
        { from: 'D', to: 'F', weight: 1 }
      ]
    },
    label: '二分图检测'
  }
};

function* steps(input) {
  const graph = JSON.parse(JSON.stringify(input));
  const nodeIds = graph.nodes.map(n => n.id);

  // 构建无向图邻接表
  const adj = {};
  for (const node of graph.nodes) {
    adj[node.id] = [];
  }
  for (const edge of graph.edges) {
    adj[edge.from].push(edge.to);
    adj[edge.to].push(edge.from);
  }

  const colors = {}; // 0: 未染色, 1: 红色, -1: 蓝色
  for (const id of nodeIds) {
    colors[id] = 0;
  }

  const colorMap = { 1: '红色', '-1': '蓝色' };
  let isBipartite = true;

  yield {
    data: { type: 'graph', value: graph },
    highlights: { nodeIds: [], edgeIds: [], visitedNodeIds: [], queueNodeIds: [] },
    variables: { colors: { ...colors }, isBipartite, phase: 'init' },
    description: '初始化染色数组：所有节点未染色（0）。红色=1，蓝色=-1。'
  };

  for (const start of nodeIds) {
    if (colors[start] !== 0) continue;

    colors[start] = 1;
    const queue = [start];

    yield {
      data: { type: 'graph', value: graph },
      highlights: {
        nodeIds: [start],
        edgeIds: [],
        visitedNodeIds: [],
        queueNodeIds: [start]
      },
      variables: {
        colors: { ...colors },
        queue: [...queue],
        current: start,
        color: colorMap[1]
      },
      description: `从节点 ${start} 开始BFS染色，将其染为红色。`
    };

    while (queue.length > 0 && isBipartite) {
      const current = queue.shift();
      const currentColor = colors[current];
      const neighborColor = -currentColor;

      for (const neighbor of adj[current] || []) {
        const edgeId = `${current}->${neighbor}`;

        if (colors[neighbor] === 0) {
          colors[neighbor] = neighborColor;
          queue.push(neighbor);

          const coloredNodes = nodeIds.filter(id => colors[id] !== 0);
          const redNodes = nodeIds.filter(id => colors[id] === 1);
          const blueNodes = nodeIds.filter(id => colors[id] === -1);

          yield {
            data: { type: 'graph', value: graph },
            highlights: {
              nodeIds: [current, neighbor],
              edgeIds: [edgeId],
              visitedNodeIds: coloredNodes,
              queueNodeIds: queue
            },
            variables: {
              colors: { ...colors },
              queue: [...queue],
              current,
              neighbor,
              currentColor: colorMap[currentColor],
              neighborColorName: colorMap[neighborColor],
              redNodes,
              blueNodes
            },
            description: `节点 ${neighbor} 未染色，将其染为${colorMap[neighborColor]}（与 ${current} 的${colorMap[currentColor]}相反）。`
          };
        } else if (colors[neighbor] === currentColor) {
          isBipartite = false;

          yield {
            data: { type: 'graph', value: graph },
            highlights: {
              nodeIds: [current, neighbor],
              edgeIds: [edgeId],
              visitedNodeIds: nodeIds.filter(id => colors[id] !== 0),
              queueNodeIds: []
            },
            variables: {
              colors: { ...colors },
              current,
              neighbor,
              currentColor: colorMap[currentColor],
              neighborColor: colorMap[colors[neighbor]],
              conflict: true,
              isBipartite
            },
            description: `冲突！节点 ${current}（${colorMap[currentColor]}）和 ${neighbor}（${colorMap[colors[neighbor]]}）颜色相同但不是同一条边！图不是二分图。`
          };
          break;
        }
      }
    }

    if (!isBipartite) break;
  }

  const colorGroups = {
    red: nodeIds.filter(id => colors[id] === 1),
    blue: nodeIds.filter(id => colors[id] === -1)
  };

  yield {
    data: { type: 'graph', value: graph },
    highlights: {
      nodeIds: isBipartite ? nodeIds : [],
      edgeIds: isBipartite ? graph.edges.map(e => `${e.from}->${e.to}`) : [],
      visitedNodeIds: isBipartite ? colorGroups.red : [],
      queueNodeIds: isBipartite ? colorGroups.blue : []
    },
    variables: {
      colors: { ...colors },
      isBipartite,
      colorGroups,
      complete: true
    },
    description: isBipartite
      ? `检测完成！该图是二分图。红色集合: {${colorGroups.red.join(', ')}}, 蓝色集合: {${colorGroups.blue.join(', ')}}`
      : '检测完成！该图不是二分图。'
  };
}

const code = [
  'function isBipartite(graph) {',
  '  const colors = {};',
  '  for (const node of graph.nodes) colors[node.id] = 0;',
  '',
  '  for (const start of graph.nodes) {',
  '    if (colors[start.id] !== 0) continue;',
  '    colors[start.id] = 1;',
  '    const queue = [start.id];',
  '',
  '    while (queue.length > 0) {',
  '      const curr = queue.shift();',
  '      for (const neighbor of graph.adj[curr]) {',
  '        if (colors[neighbor] === 0) {',
  '          colors[neighbor] = -colors[curr];',
  '          queue.push(neighbor);',
  '        } else if (colors[neighbor] === colors[curr]) {',
  '          return false;',
  '        }',
  '      }',
  '    }',
  '  }',
  '',
  '  return true;',
  '}'
];

module.exports = { meta, steps, code };
