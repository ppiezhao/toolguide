const meta = {
  id: 'union-find',
  name: '并查集',
  nameEn: 'Union-Find / Disjoint Set Union',
  difficulty: 'medium',
  category: 'graph',
  tags: ['并查集', 'DSU', '不相交集合', '路径压缩', '按秩合并'],
  timeComplexity: 'O(alpha(n)) 均摊',
  spaceComplexity: 'O(n)',
  description: '并查集（Union-Find）是一种用于处理不相交集合的数据结构。它支持两种操作：查找（Find）确定元素属于哪个集合，合并（Union）将两个集合合并为一个。通过路径压缩和按秩合并优化，每次操作的时间复杂度接近O(1)。',
  defaultInput: {
    type: 'graph',
    value: {
      nodes: [
        { id: '1', label: '1' },
        { id: '2', label: '2' },
        { id: '3', label: '3' },
        { id: '4', label: '4' },
        { id: '5', label: '5' },
        { id: '6', label: '6' }
      ],
      edges: []
    },
    label: '并查集: 初始化6个独立集合'
  }
};

function* steps(input) {
  const graph = JSON.parse(JSON.stringify(input));
  const nodeIds = graph.nodes.map(n => n.id);

  // 初始化
  const parent = {};
  const rank = {};
  for (const id of nodeIds) {
    parent[id] = id;
    rank[id] = 0;
  }

  // Step 1: 初始化
  yield {
    data: { type: 'graph', value: graph },
    highlights: { nodeIds: [], edgeIds: [], visitedNodeIds: [], queueNodeIds: [] },
    variables: { parent: { ...parent }, rank: { ...rank }, sets: nodeIds.map(id => [id]), step: 'init' },
    description: `初始化并查集：每个节点独立成集，parent[i]=i，rank[i]=0。`
  };

  // Union(1,2)
  const ops = [
    [1, 2], [3, 4], [5, 6],
    [1, 3], [4, 6]
  ];

  for (const [x, y] of ops) {
    const px = parent[x];
    const py = parent[y];

    const findXPath = [];
    let fx = x;
    while (parent[fx] !== fx) {
      findXPath.push(fx);
      fx = parent[fx];
    }
    findXPath.push(fx);

    const findYPath = [];
    let fy = y;
    while (parent[fy] !== fy) {
      findYPath.push(fy);
      fy = parent[fy];
    }
    findYPath.push(fy);

    // 显示查找过程
    yield {
      data: { type: 'graph', value: graph },
      highlights: {
        nodeIds: findXPath.concat(findYPath),
        edgeIds: [],
        visitedNodeIds: [fx, fy],
        queueNodeIds: []
      },
      variables: {
        parent: { ...parent },
        rank: { ...rank },
        operation: `find(${x})`,
        find_X_Path: findXPath.join('->'),
        find_Y_Path: findYPath.join('->'),
        rootX: fx,
        rootY: fy
      },
      description: `查找 ${x} 的根节点：路径 ${x} -> ${findXPath.join(' -> ')}，根为 ${fx}。查找 ${y} 的根节点：路径 ${y} -> ${findYPath.join(' -> ')}，根为 ${fy}。`
    };

    if (fx === fy) {
      continue;
    }

    // 按秩合并
    const edgeId = `${Math.min(x, y)}->${Math.max(x, y)}`;
    if (rank[fx] < rank[fy]) {
      parent[fx] = fy;
    } else if (rank[fx] > rank[fy]) {
      parent[fy] = fx;
    } else {
      parent[fy] = fx;
      rank[fx]++;
    }

    // 更新集合
    const setsMap = {};
    for (const id of nodeIds) {
      let root = id;
      while (parent[root] !== root) root = parent[root];
      if (!setsMap[root]) setsMap[root] = [];
      setsMap[root].push(id);
    }
    const sets = Object.values(setsMap);

    yield {
      data: { type: 'graph', value: graph },
      highlights: {
        nodeIds: [x, y],
        edgeIds: [edgeId],
        visitedNodeIds: [fx, fy],
        queueNodeIds: []
      },
      variables: {
        parent: { ...parent },
        rank: { ...rank },
        operation: `union(${x}, ${y})`,
        sets,
        edgeId
      },
      description: `合并 ${x} 和 ${y}：root(${x})=${fx}，root(${y})=${fy}，按秩合并后根为 ${parent[fy] === fx ? fx : fy}。当前集合: ${sets.map(s => `{${s.join(',')}}`).join(' ')}`
    };
  }

  // 路径压缩演示
  const setsMap = {};
  for (const id of nodeIds) {
    let root = id;
    while (parent[root] !== root) root = parent[root];
    if (!setsMap[root]) setsMap[root] = [];
    setsMap[root].push(id);
  }
  const sets = Object.values(setsMap);

  yield {
    data: { type: 'graph', value: graph },
    highlights: {
      nodeIds: nodeIds,
      edgeIds: sets.map(s => `${s[0]}->${s[s.length-1]}`),
      visitedNodeIds: nodeIds,
      queueNodeIds: []
    },
    variables: {
      parent: { ...parent },
      rank: { ...rank },
      sets,
      complete: true
    },
    description: `并查集操作完成！最终集合: ${sets.map(s => `{${s.join(',')}}`).join(' ')}。包含操作: union(1,2), union(3,4), union(5,6), union(1,3), union(4,6) => 所有节点最终在同一集合。`
  };
}

const code = [
  'class UnionFind {',
  '  constructor(n) {',
  '    this.parent = Array.from({length: n}, (_, i) => i);',
  '    this.rank = new Array(n).fill(0);',
  '  }',
  '',
  '  find(x) {',
  '    if (this.parent[x] !== x) {',
  '      this.parent[x] = this.find(this.parent[x]);',
  '    }',
  '    return this.parent[x];',
  '  }',
  '',
  '  union(x, y) {',
  '    const px = this.find(x), py = this.find(y);',
  '    if (px === py) return false;',
  '    if (this.rank[px] < this.rank[py]) this.parent[px] = py;',
  '    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;',
  '    else { this.parent[py] = px; this.rank[px]++; }',
  '    return true;',
  '  }',
  '}'
];

module.exports = { meta, steps, code };
