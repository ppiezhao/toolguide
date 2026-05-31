const meta = {
  id: 'min-path-sum',
  name: '最小路径和',
  nameEn: 'Minimum Path Sum',
  difficulty: 'medium',
  category: 'dp',
  tags: ['最小路径和', '动态规划', '网格'],
  timeComplexity: 'O(m * n)',
  spaceComplexity: 'O(m * n)',
  description: '最小路径和问题：给定一个包含非负整数的 m x n 网格，找到一条从左上角到右下角的路径，使得路径上的数字总和最小。每次只能向右或向下移动一步。',
  defaultInput: {
    type: 'matrix',
    value: [
      [1, 3, 1],
      [1, 5, 1],
      [4, 2, 1]
    ],
    label: '3x3网格（数字为路径代价）'
  }
};

function* steps(input) {
  const grid = [
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1]
  ];
  const m = grid.length;
  const n = grid[0].length;

  const dp = Array.from({ length: m }, () => Array(n).fill(0));
  dp[0][0] = grid[0][0];

  yield {
    data: { type: 'matrix', value: dp.map(r => [...r]) },
    highlights: { matrixCells: [[0, 0]], computedCells: [], compareCells: [] },
    variables: { dp: dp.map(r => [...r]), grid, m, n, phase: 'init', rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    description: `初始化：dp[0][0]=grid[0][0]=${grid[0][0]}。`
  };

  // 初始化第一列
  for (let i = 1; i < m; i++) {
    dp[i][0] = dp[i - 1][0] + grid[i][0];
    yield {
      data: { type: 'matrix', value: dp.map(r => [...r]) },
      highlights: { matrixCells: [[i, 0]], computedCells: [[i - 1, 0]], compareCells: [] },
      variables: { dp: dp.map(r => [...r]), grid, i, phase: 'col_init', rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
      description: `第一列 dp[${i}][0] = dp[${i - 1}][0] + grid[${i}][0] = ${dp[i - 1][0]} + ${grid[i][0]} = ${dp[i][0]}`
    };
  }

  // 初始化第一行
  for (let j = 1; j < n; j++) {
    dp[0][j] = dp[0][j - 1] + grid[0][j];
    yield {
      data: { type: 'matrix', value: dp.map(r => [...r]) },
      highlights: { matrixCells: [[0, j]], computedCells: [[0, j - 1]], compareCells: [] },
      variables: { dp: dp.map(r => [...r]), grid, j, phase: 'row_init', rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
      description: `第一行 dp[0][${j}] = dp[0][${j - 1}] + grid[0][${j}] = ${dp[0][j - 1]} + ${grid[0][j]} = ${dp[0][j]}`
    };
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];

      yield {
        data: { type: 'matrix', value: dp.map(r => [...r]) },
        highlights: { matrixCells: [[i, j]], computedCells: [[i - 1, j], [i, j - 1]], compareCells: [] },
        variables: {
          dp: dp.map(r => [...r]),
          grid, i, j,
          fromTop: dp[i - 1][j],
          fromLeft: dp[i][j - 1],
          minPrev: Math.min(dp[i - 1][j], dp[i][j - 1]),
          gridVal: grid[i][j],
          total: dp[i][j],
          rowLabels: ['0', '1', '2'],
          colLabels: ['0', '1', '2']
        },
        description: `dp[${i}][${j}] = min(dp[${i - 1}][${j}]=${dp[i - 1][j]}, dp[${i}][${j - 1}]=${dp[i][j - 1]}) + grid[${i}][${j}]=${grid[i][j]} = ${dp[i][j]}`
      };
    }
  }

  yield {
    data: { type: 'matrix', value: dp.map(r => [...r]) },
    highlights: { matrixCells: [[m - 1, n - 1]], computedCells: [], compareCells: [] },
    variables: {
      dp: dp.map(r => [...r]),
      grid,
      m, n,
      result: dp[m - 1][n - 1],
      complete: true,
      rowLabels: ['0', '1', '2'],
      colLabels: ['0', '1', '2']
    },
    description: `计算完成！最小路径和为 ${dp[m - 1][n - 1]}`
  };
}

const code = [
  'function minPathSum(grid) {',
  '  const m = grid.length, n = grid[0].length;',
  '  const dp = Array.from({length: m}, () => Array(n).fill(0));',
  '  dp[0][0] = grid[0][0];',
  '',
  '  for (let i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];',
  '  for (let j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];',
  '',
  '  for (let i = 1; i < m; i++) {',
  '    for (let j = 1; j < n; j++) {',
  '      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];',
  '    }',
  '  }',
  '',
  '  return dp[m - 1][n - 1];',
  '}'
];

module.exports = { meta, steps, code };
