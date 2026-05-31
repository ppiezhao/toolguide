const meta = {
  id: 'kruskal',
  name: 'Kruskal最小生成树',
  nameEn: "Kruskal's Minimum Spanning Tree",
  difficulty: 'medium',
  category: 'graph',
  tags: ['最小生成树', 'Kruskal', '并查集', '贪心', 'MST'],
  timeComplexity: 'O(E log E)',
  spaceComplexity: 'O(V + E)',
  description: 'Kruskal算法是一种用于在加权连通图中查找最小生成树的算法。它将所有边按权重排序，然后从小到大依次选择边，如果该边连接的两个节点不在同一集合中，则将其加入MST。该算法使用并查集来检测环路。',
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
    label: '图: Kruskal最小生成树算法'
  }
};

class UnionFind {
  constructor(nodes) {
    this.parent = {};
    this.rank = {};
    for (const n of nodes) {
      this.parent[n] = n;
      this.rank[n] = 0;
    }
  }
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
  union(x, y) {
    const px = this.find(x);
    const py = this.find(y);
    if (px === py) return false;
    if (this.rank[px] < this.rank[py]) {
      this.parent[px] = py;
    } else if (this.rank[px] > this.rank[py]) {
      this.parent[py] = px;
    } else {
      this.parent[py] = px;
      this.rank[px]++;
    }
    return true;
  }
}

function* steps(input) {
  const graph = JSON.parse(JSON.stringify(input));
  const nodeIds = graph.nodes.map(n => n.id);

  // 按权重排序所有边
  const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);

  const uf = new UnionFind(nodeIds);
  const mstEdges = [];
  let totalWeight = 0;
  let rejectedEdges = [];
  let consideredEdges = [];

  // Step 1: 显示排序后的边
  yield {
    data: { type: 'graph', value: graph },
    highlights: { nodeIds: [], edgeIds: [], visitedNodeIds: [], queueNodeIds: [] },
    variables: {
      sortedEdges: sortedEdges.map(e => `${e.from}->${e.to}(${e.weight})`),
      mstEdges: [],
      totalWeight: 0,
      parent: { ...uf.parent },
      status: 'sorted'
    },
    description: `将所有边按权重排序：${sortedEdges.map(e => `${e.from}-${e.to}(${e.weight})`).join(', ')}`
  };

  for (const edge of sortedEdges) {
    const edgeId = `${edge.from}->${edge.to}`;
    consideredEdges.push(edgeId);

    if (uf.union(edge.from, edge.to)) {
      mstEdges.push(edgeId);
      totalWeight += edge.weight;

      yield {
        data: { type: 'graph', value: graph },
        highlights: {
          nodeIds: [edge.from, edge.to],
          edgeIds: mstEdges,
          visitedNodeIds: mstEdges.flatMap(e => e.split('->')),
          queueNodeIds: []
        },
        variables: {
          sortedEdges: sortedEdges.map(e => `${e.from}->${e.to}(${e.weight})`),
          mstEdges: [...mstEdges],
          totalWeight,
          parent: { ...uf.parent },
          currentEdge: edgeId,
          weight: edge.weight,
          action: 'accepted',
          consideredEdges: [...consideredEdges]
        },
        description: `接受边 ${edgeId}（权重=${edge.weight}）：连接了两个不同的连通分量，加入MST。`
      };
    } else {
      rejectedEdges.push(edgeId);

      yield {
        data: { type: 'graph', value: graph },
        highlights: {
          nodeIds: [edge.from, edge.to],
          edgeIds: mstEdges,
          visitedNodeIds: mstEdges.flatMap(e => e.split('->')),
          queueNodeIds: []
        },
        variables: {
          sortedEdges: sortedEdges.map(e => `${e.from}->${e.to}(${e.weight})`),
          mstEdges: [...mstEdges],
          totalWeight,
          parent: { ...uf.parent },
          currentEdge: edgeId,
          weight: edge.weight,
          action: 'rejected',
          consideredEdges: [...consideredEdges]
        },
        description: `拒绝边 ${edgeId}（权重=${edge.weight}）：两个节点已在同一连通分量中，加入会形成环。`
      });
    }
  }

  yield {
    data: { type: 'graph', value: graph },
    highlights: {
      nodeIds: nodeIds,
      edgeIds: mstEdges,
      visitedNodeIds: nodeIds,
      queueNodeIds: []
    },
    variables: {
      sortedEdges: sortedEdges.map(e => `${e.from}->${e.to}(${e.weight})`),
      mstEdges: [...mstEdges],
      totalWeight,
      parent: { ...uf.parent },
      rejectedEdges: [...rejectedEdges],
      complete: true
    },
    description: `Kruskal算法完成！MST包含边: ${mstEdges.join(', ')}，总权重=${totalWeight}。`
  };
}

const code = [
  'function kruskal(nodes, edges) {',
  '  const uf = new UnionFind(nodes);',
  '  const sortedEdges = edges.sort((a, b) => a.weight - b.weight);',
  '  const mst = [];',
  '',
  '  for (const edge of sortedEdges) {',
  '    if (uf.union(edge.from, edge.to)) {',
  '      mst.push(edge);',
  '    }',
  '  }',
  '',
  '  return mst;',
  '}',
  '',
  'class UnionFind {',
  '  constructor(elements) {',
  '    this.parent = {};',
  '    this.rank = {};',
  '    for (const e of elements) {',
  '      this.parent[e] = e;',
  '      this.rank[e] = 0;',
  '    }',
  '  }',
  '  find(x) {',
  '    if (this.parent[x] !== x) {',
  '      this.parent[x] = this.find(this.parent[x]);',
  '    }',
  '    return this.parent[x];',
  '  }',
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
