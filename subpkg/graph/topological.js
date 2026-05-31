const meta = {
  id: 'topological',
  name: '拓扑排序',
  nameEn: 'Topological Sort',
  difficulty: 'medium',
  category: 'graph',
  tags: ['拓扑排序', 'DAG', '有向无环图', '队列'],
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  description: '拓扑排序是对有向无环图（DAG）的顶点进行线性排序，使得对于每一条有向边 u->v，顶点 u 在排序中都出现在顶点 v 之前。拓扑排序常用于任务调度、依赖解析等场景。这里使用Kahn算法（基于入度）。',
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
        { from: 'A', to: 'C', weight: 1 },
        { from: 'B', to: 'C', weight: 1 },
        { from: 'C', to: 'D', weight: 1 },
        { from: 'D', to: 'E', weight: 1 },
        { from: 'D', to: 'F', weight: 1 }
      ]
    },
    label: 'DAG: 拓扑排序'
  }
};

function* steps(input) {
  const graph = JSON.parse(JSON.stringify(input));
  const nodeIds = graph.nodes.map(n => n.id);

  // 构建邻接表和入度
  const adj = {};
  const inDegree = {};
  for (const node of graph.nodes) {
    adj[node.id] = [];
    inDegree[node.id] = 0;
  }
  for (const edge of graph.edges) {
    adj[edge.from].push(edge.to);
    inDegree[edge.to] = (inDegree[edge.to] || 0) + 1;
  }

  // Step 1: 显示初始入度
  yield {
    data: { type: 'graph', value: graph },
    highlights: { nodeIds: [], edgeIds: [], visitedNodeIds: [], queueNodeIds: [] },
    variables: { inDegree: { ...inDegree }, queue: [], result: [], step: 'init' },
    description: `初始化：计算每个节点的入度。入度: ${Object.entries(inDegree).map(([k, v]) => `${k}:${v}`).join(', ')}`
  };

  // 将所有入度为0的节点加入队列
  const queue = [];
  for (const id of nodeIds) {
    if (inDegree[id] === 0) {
      queue.push(id);
    }
  }

  yield {
    data: { type: 'graph', value: graph },
    highlights: { nodeIds: queue, edgeIds: [], visitedNodeIds: [], queueNodeIds: queue },
    variables: { inDegree: { ...inDegree }, queue: [...queue], result: [], step: 'queue_init' },
    description: `将入度为0的节点加入队列: ${queue.join(', ')}`
  };

  const result = [];

  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);

    yield {
      data: { type: 'graph', value: graph },
      highlights: {
        nodeIds: [current],
        edgeIds: [],
        visitedNodeIds: result,
        queueNodeIds: queue
      },
      variables: { inDegree: { ...inDegree }, queue: [...queue], result: [...result], current },
      description: `将节点 ${current} 从队列取出，加入拓扑排序结果。当前结果: ${result.join(' -> ')}`
    };

    // 减少邻居的入度
    for (const neighbor of adj[current] || []) {
      inDegree[neighbor]--;
      const edgeId = `${current}->${neighbor}`;

      yield {
        data: { type: 'graph', value: graph },
        highlights: {
          nodeIds: [current, neighbor],
          edgeIds: [edgeId],
          visitedNodeIds: result,
          queueNodeIds: queue
        },
        variables: {
          inDegree: { ...inDegree },
          queue: [...queue],
          result: [...result],
          current,
          neighbor,
          edge: edgeId
        },
        description: `移除边 ${edgeId}，节点 ${neighbor} 的入度减为 ${inDegree[neighbor]}。`
      };

      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);

        yield {
          data: { type: 'graph', value: graph },
          highlights: {
            nodeIds: [neighbor],
            edgeIds: [],
            visitedNodeIds: result,
            queueNodeIds: queue
          },
          variables: {
            inDegree: { ...inDegree },
            queue: [...queue],
            result: [...result],
            neighbor
          },
          description: `节点 ${neighbor} 的入度变为0，加入队列。当前队列: ${queue.join(', ')}`
        };
      }
    }
  }

  const isDAG = result.length === nodeIds.length;

  yield {
    data: { type: 'graph', value: graph },
    highlights: {
      nodeIds: isDAG ? result : [],
      edgeIds: [],
      visitedNodeIds: result,
      queueNodeIds: []
    },
    variables: { inDegree: { ...inDegree }, queue: [], result: [...result], isDAG, complete: true },
    description: isDAG
      ? `拓扑排序完成！排序结果: ${result.join(' -> ')}`
      : `图中存在环！拓扑排序无法完成。已处理 ${result.length}/${nodeIds.length} 个节点。`
  };
}

const code = [
  'function topologicalSort(graph) {',
  '  const inDegree = {}, queue = [], result = [];',
  '  for (const node of graph.nodes) {',
  '    inDegree[node.id] = 0;',
  '  }',
  '  for (const edge of graph.edges) {',
  '    inDegree[edge.to]++;',
  '  }',
  '',
  '  for (const id of Object.keys(inDegree)) {',
  '    if (inDegree[id] === 0) queue.push(id);',
  '  }',
  '',
  '  while (queue.length > 0) {',
  '    const current = queue.shift();',
  '    result.push(current);',
  '    for (const neighbor of graph.adj[current]) {',
  '      inDegree[neighbor]--;',
  '      if (inDegree[neighbor] === 0) queue.push(neighbor);',
  '    }',
  '  }',
  '',
  '  return result.length === graph.nodes.length',
  '    ? result : [];',
  '}'
];

module.exports = { meta, steps, code };
