const meta = {
  id: 'num-islands',
  name: '岛屿数量',
  nameEn: 'Number of Islands',
  difficulty: 'medium',
  category: 'graph',
  tags: ['矩阵', 'DFS', 'BFS', '连通分量', '网格'],
  timeComplexity: 'O(m * n)',
  spaceComplexity: 'O(m * n)',
  description: '岛屿数量问题：给定一个由 "1"（陆地）和 "0"（水）组成的二维网格，计算网格中岛屿的数量。岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。可以使用DFS、BFS或并查集解决。',
  defaultInput: {
    type: 'matrix',
    value: [
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1]
    ],
    label: '4x5网格: 1=陆地, 0=水'
  }
};

function* steps(input) {
  const grid = JSON.parse(JSON.stringify(input));
  const rows = grid.length;
  const cols = grid[0].length;

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  let islandCount = 0;

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  yield {
    data: { type: 'matrix', value: grid },
    highlights: { matrixCells: [], computedCells: [], compareCells: [] },
    variables: { grid, visited: visited.map(r => [...r]), islandCount, currentIsland: 0, phase: 'init' },
    description: `初始化：网格 ${rows}x${cols}，'1' 表示陆地，'0' 表示水。开始遍历每个格子寻找岛屿。`
  };

  function* dfs(r, c, islandId) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (grid[r][c] === 0 || visited[r][c]) return;

    visited[r][c] = true;

    yield {
      data: { type: 'matrix', value: grid },
      highlights: { matrixCells: [[r, c]], computedCells: [], compareCells: [] },
      variables: {
        grid,
        visited: visited.map(row => [...row]),
        islandCount,
        currentPosition: [r, c],
        currentIsland: islandId,
        phase: 'visiting'
      },
      description: `标记岛屿 #${islandId} 的格子 (${r},${c}) 为已访问。`
    };

    for (const [dr, dc] of directions) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1 && !visited[nr][nc]) {
        yield {
          data: { type: 'matrix', value: grid },
          highlights: { matrixCells: [[nr, nc]], computedCells: [[r, c]], compareCells: [] },
          variables: {
            grid,
            visited: visited.map(row => [...row]),
            islandCount,
            currentPosition: [r, c],
            nextPosition: [nr, nc],
            currentIsland: islandId,
            direction: [dr, dc],
            phase: 'exploring'
          },
          description: `从 (${r},${c}) 向 (${nr},${nc}) 扩展搜索。`
        };
      }
      yield* dfs(nr, nc, islandId);
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1 && !visited[r][c]) {
        islandCount++;

        yield {
          data: { type: 'matrix', value: grid },
          highlights: { matrixCells: [[r, c]], computedCells: [], compareCells: [] },
          variables: {
            grid,
            visited: visited.map(row => [...row]),
            islandCount,
            currentPosition: [r, c],
            currentIsland: islandCount,
            phase: 'found_new'
          },
          description: `在 (${r},${c}) 发现新岛屿 #${islandCount}！开始DFS遍历。`
        };

        yield* dfs(r, c, islandCount);

        yield {
          data: { type: 'matrix', value: grid },
          highlights: { matrixCells: [], computedCells: [], compareCells: [] },
          variables: {
            grid,
            visited: visited.map(row => [...row]),
            islandCount,
            phase: 'island_complete'
          },
          description: `岛屿 #${islandCount} 遍历完成。`
        };
      }
    }
  }

  // 标记已访问的格子
  const visitedGrid = grid.map((row, r) => row.map((val, c) => val === 1 && visited[r][c] ? 2 : val));

  yield {
    data: { type: 'matrix', value: visitedGrid },
    highlights: {
      matrixCells: Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => [r, c])
      ).flat(),
      computedCells: [],
      compareCells: []
    },
    variables: {
      grid,
      visited: visited.map(row => [...row]),
      islandCount,
      complete: true
    },
    description: `岛屿数量统计完成！共发现 ${islandCount} 个岛屿。`
  };
}

const code = [
  'function numIslands(grid) {',
  '  if (!grid || grid.length === 0) return 0;',
  '  const rows = grid.length, cols = grid[0].length;',
  '  let count = 0;',
  '',
  '  function dfs(r, c) {',
  '    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === "0") return;',
  '    grid[r][c] = "0";',
  '    dfs(r - 1, c);',
  '    dfs(r + 1, c);',
  '    dfs(r, c - 1);',
  '    dfs(r, c + 1);',
  '  }',
  '',
  '  for (let r = 0; r < rows; r++) {',
  '    for (let c = 0; c < cols; c++) {',
  '      if (grid[r][c] === "1") {',
  '        count++;',
  '        dfs(r, c);',
  '      }',
  '    }',
  '  }',
  '',
  '  return count;',
  '}'
];

module.exports = { meta, steps, code };
