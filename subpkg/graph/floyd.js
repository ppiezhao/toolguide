const meta = {
  id: 'floyd',
  name: 'Floyd-Warshall算法',
  nameEn: 'Floyd-Warshall Algorithm',
  difficulty: 'hard',
  category: 'graph',
  tags: ['最短路径', 'Floyd-Warshall', '动态规划', '全源最短路径'],
  timeComplexity: 'O(V^3)',
  spaceComplexity: 'O(V^2)',
  description: 'Floyd-Warshall算法是一种用于在加权图中计算所有节点对之间最短路径的动态规划算法。它通过逐渐允许路径经过更多中间节点来递推地更新最短路径距离矩阵。',
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
        { from: 'A', to: 'B', weight: 3 },
        { from: 'A', to: 'D', weight: 5 },
        { from: 'B', to: 'A', weight: 2 },
        { from: 'B', to: 'C', weight: 4 },
        { from: 'C', to: 'D', weight: 1 },
        { from: 'D', to: 'C', weight: 7 }
      ]
    },
    label: '图: Floyd-Warshall全部最短路径'
  }
};

function* steps(input) {
  const graph = JSON.parse(JSON.stringify(input));
  const nodeIds = graph.nodes.map(n => n.id);
  const n = nodeIds.length;

  const INF = Infinity;

  // 初始化距离矩阵
  const dist = Array.from({ length: n }, () => Array(n).fill(INF));
  const next = Array.from({ length: n }, () => Array(n).fill(null));

  const idxMap = {};
  nodeIds.forEach((id, i) => { idxMap[id] = i; });
  const idFromIdx = nodeIds;

  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }

  for (const edge of graph.edges) {
    const i = idxMap[edge.from];
    const j = idxMap[edge.to];
    dist[i][j] = edge.weight;
    next[i][j] = j;
  }

  // 格式化矩阵显示
  const formatMatrix = (matrix) => {
    return matrix.map(row => row.map(v => v === INF ? '∞' : v));
  };

  // Step 1: 初始矩阵
  yield {
    data: { type: 'matrix', value: formatMatrix(dist) },
    highlights: { matrixCells: [], computedCells: [], compareCells: [] },
    variables: {
      matrix: formatMatrix(dist),
      k: -1,
      phase: 'init',
      nodeIds,
      rowLabels: nodeIds,
      colLabels: nodeIds
    },
    description: `初始化距离矩阵 D(0)：对角线为0，有直接边则填权重，否则为∞。`
  };

  // Floyd-Warshall核心
  for (let k = 0; k < n; k++) {
    yield {
      data: { type: 'matrix', value: formatMatrix(dist) },
      highlights: {
        matrixCells: [],
        computedCells: [],
        compareCells: Array.from({ length: n }, (_, i) => [i, k]).concat(
          Array.from({ length: n }, (_, j) => [k, j])
        )
      },
      variables: {
        matrix: formatMatrix(dist),
        k,
        intermediateNode: idFromIdx[k],
        phase: 'choose_k',
        nodeIds,
        rowLabels: nodeIds,
        colLabels: nodeIds
      },
      description: `第 k=${k} 轮：允许经过中间节点 ${idFromIdx[k]}，更新所有节点对之间的距离。`
    };

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== INF && dist[k][j] !== INF) {
          const newDist = dist[i][k] + dist[k][j];
          if (newDist < dist[i][j]) {
            const oldDist = dist[i][j];
            dist[i][j] = newDist;
            next[i][j] = next[i][k];

            yield {
              data: { type: 'matrix', value: formatMatrix(dist) },
              highlights: {
                matrixCells: [[i, j]],
                computedCells: [[i, k], [k, j]],
                compareCells: Array.from({ length: n }, (_, x) => [x, k]).concat(
                  Array.from({ length: n }, (_, y) => [k, y])
                )
              },
              variables: {
                matrix: formatMatrix(dist),
                k,
                i,
                j,
                from: idFromIdx[i],
                to: idFromIdx[j],
                intermediate: idFromIdx[k],
                oldDist: oldDist === INF ? '∞' : oldDist,
                newDist,
                updated: true,
                path: `${idFromIdx[i]}->${idFromIdx[k]}->${idFromIdx[j]}`,
                nodeIds,
                rowLabels: nodeIds,
                colLabels: nodeIds
              },
              description: `更新 dist[${idFromIdx[i]}][${idFromIdx[j]}]：经过 ${idFromIdx[k]} 的路径 dist[${idFromIdx[i]}][${idFromIdx[k]}](${dist[i][k] - (dist[i][k] > 0 && typeof dist[i][k] === 'number' ? (newDist - (dist[i][k] + dist[k][j] - dist[i][j])) : 0)}) + dist[${idFromIdx[k]}][${idFromIdx[j]}](${dist[k][j]}) = ${newDist} < ${oldDist === INF ? '∞' : oldDist}，更新！`
            };
          }
        }
      }
    }
  }

  // 最终结果
  yield {
    data: { type: 'matrix', value: formatMatrix(dist) },
    highlights: {
      matrixCells: Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => [i, j])).flat(),
      computedCells: [],
      compareCells: []
    },
    variables: {
      matrix: formatMatrix(dist),
      k: n - 1,
      complete: true,
      nodeIds,
      rowLabels: nodeIds,
      colLabels: nodeIds
    },
    description: `Floyd-Warshall算法完成！最终距离矩阵显示了所有节点对之间的最短路径。`
  };
}

const code = [
  'function floydWarshall(graph) {',
  '  const n = graph.nodes.length;',
  '  const dist = Array.from({length: n}, () => Array(n).fill(Infinity));',
  '',
  '  for (let i = 0; i < n; i++) dist[i][i] = 0;',
  '  for (const edge of graph.edges) {',
  '    dist[edge.from][edge.to] = edge.weight;',
  '  }',
  '',
  '  for (let k = 0; k < n; k++) {',
  '    for (let i = 0; i < n; i++) {',
  '      for (let j = 0; j < n; j++) {',
  '        if (dist[i][k] + dist[k][j] < dist[i][j]) {',
  '          dist[i][j] = dist[i][k] + dist[k][j];',
  '        }',
  '      }',
  '    }',
  '  }',
  '',
  '  return dist;',
  '}'
];

module.exports = { meta, steps, code };
