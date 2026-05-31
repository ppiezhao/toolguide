const meta = {
  id: 'clone-graph',
  name: '克隆图',
  nameEn: 'Clone Graph',
  difficulty: 'medium',
  category: 'graph',
  tags: ['图', 'DFS', 'BFS', '深拷贝', '哈希表'],
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  description: '克隆图问题要求对一张图进行深拷贝。给定一个无向连通图的引用，需要创建一个结构和值完全相同的新图。使用DFS或BFS遍历原图，并用哈希表记录已克隆的节点以避免重复克隆。',
  defaultInput: {
    type: 'graph',
    value: {
      nodes: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' },
        { id: 'D', label: 'D' }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'A', to: 'C', weight: 1 },
        { from: 'B', to: 'D', weight: 1 },
        { from: 'C', to: 'D', weight: 1 }
      ]
    },
    label: '克隆图'
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
    adj[edge.from].push(edge.to);
    adj[edge.to].push(edge.from);
  }

  const cloned = {};
  let cloneIndex = 0;
  const cloneOrder = [];

  yield {
    data: { type: 'graph', value: graph },
    highlights: { nodeIds: [], edgeIds: [], visitedNodeIds: [], queueNodeIds: [] },
    variables: { cloned: { ...cloned }, phase: 'init', clonedCount: 0 },
    description: '准备克隆图结构。使用哈希表记录已克隆的节点，从A开始DFS遍历克隆。'
  };

  // DFS克隆
  function* dfsClone(nodeId) {
    if (cloned[nodeId]) return;

    // 克隆当前节点
    const cloneLabel = `${nodeId}'`;
    cloned[nodeId] = cloneLabel;
    cloneIndex++;

    const clonedList = Object.entries(cloned).map(([k, v]) => `${k}->${v}`);

    yield {
      data: { type: 'graph', value: graph },
      highlights: {
        nodeIds: [nodeId],
        edgeIds: [],
        visitedNodeIds: Object.keys(cloned),
        queueNodeIds: []
      },
      variables: {
        cloned: { ...cloned },
        clonedList,
        currentOriginal: nodeId,
        currentClone: cloneLabel,
        cloneOrder: [...cloneOrder],
        phase: 'clone_node'
      },
      description: `克隆节点 ${nodeId} 为 ${cloneLabel}。已克隆: ${Object.keys(cloned).join(', ')}`
    };

    cloneOrder.push(nodeId);

    for (const neighbor of adj[nodeId] || []) {
      const edgeId = `${nodeId}->${neighbor}`;

      yield {
        data: { type: 'graph', value: graph },
        highlights: {
          nodeIds: [nodeId, neighbor],
          edgeIds: [edgeId],
          visitedNodeIds: Object.keys(cloned),
          queueNodeIds: []
        },
        variables: {
          cloned: { ...cloned },
          clonedList: Object.entries(cloned).map(([k, v]) => `${k}->${v}`),
          currentOriginal: nodeId,
          neighbor,
          edge: edgeId,
          phase: 'explore_edge'
        },
        description: `遍历到邻居 ${neighbor}${cloned[neighbor] ? '（已克隆，跳过）' : '（需要克隆）'}。`
      };

      if (!cloned[neighbor]) {
        yield* dfsClone(neighbor);
      }
    }
  }

  yield* dfsClone('A');

  // 构建克隆图显示
  const clonedNodes = Object.entries(cloned).map(([orig, label]) => ({
    id: label,
    label
  }));
  const clonedEdges = [];
  for (const edge of graph.edges) {
    if (cloned[edge.from] && cloned[edge.to]) {
      clonedEdges.push({
        from: cloned[edge.from],
        to: cloned[edge.to],
        weight: edge.weight
      });
    }
  }

  yield {
    data: { type: 'graph', value: graph },
    highlights: {
      nodeIds: nodeIds,
      edgeIds: graph.edges.map(e => `${e.from}->${e.to}`),
      visitedNodeIds: nodeIds,
      queueNodeIds: []
    },
    variables: {
      cloned: { ...cloned },
      clonedNodes: clonedNodes.map(n => n.id),
      clonedEdges: clonedEdges.map(e => `${e.from}->${e.to}`),
      cloneCount: nodeIds.length,
      complete: true
    },
    description: `克隆完成！原图 ${nodeIds.length} 个节点全部克隆。映射关系: ${Object.entries(cloned).map(([k, v]) => `${k}->${v}`).join(', ')}`
  };
}

const code = [
  'function cloneGraph(node, visited = new Map()) {',
  '  if (!node) return null;',
  '  if (visited.has(node)) return visited.get(node);',
  '',
  '  const clone = new Node(node.val);',
  '  visited.set(node, clone);',
  '',
  '  for (const neighbor of node.neighbors) {',
  '    clone.neighbors.push(cloneGraph(neighbor, visited));',
  '  }',
  '',
  '  return clone;',
  '}',
  '',
  'class Node {',
  '  constructor(val) {',
  '    this.val = val;',
  '    this.neighbors = [];',
  '  }',
  '}'
];

module.exports = { meta, steps, code };
