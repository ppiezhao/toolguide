const meta = {
  id: 'unique-paths',
  name: '不同路径',
  nameEn: 'Unique Paths',
  difficulty: 'medium',
  category: 'dp',
  tags: ['不同路径', '动态规划', '网格', '组合'],
  timeComplexity: 'O(m * n)',
  spaceComplexity: 'O(m * n)',
  description: '不同路径问题：一个机器人在 m x n 的网格左上角，每次只能向右或向下移动一步，要到达右下角。计算有多少条不同的路径。使用二维DP表，dp[i][j]表示到达(i,j)的路径数，递推式为 dp[i][j] = dp[i-1][j] + dp[i][j-1]。',
  defaultInput: {
    type: 'matrix',
    value: [[3, 3]],
    label: '网格: 3x3'
  }
};

function* steps(input) {
  const m = 3;
  const n = 3;

  const dp = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;

  yield {
    data: { type: 'matrix', value: dp.map(r => [...r]) },
    highlights: { matrixCells: [], computedCells: [], compareCells: [] },
    variables: { dp: dp.map(r => [...r]), m, n, phase: 'init', rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    description: `初始化${m}x${n}网格DP表：第一行和第一列都为1（只有一条路径）。`
  };

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];

      yield {
        data: { type: 'matrix', value: dp.map(r => [...r]) },
        highlights: { matrixCells: [[i, j]], computedCells: [[i - 1, j], [i, j - 1]], compareCells: [] },
        variables: {
          dp: dp.map(r => [...r]),
          m, n, i, j,
          fromTop: dp[i - 1][j],
          fromLeft: dp[i][j - 1],
          total: dp[i][j],
          rowLabels: ['0', '1', '2'],
          colLabels: ['0', '1', '2']
        },
        description: `dp[${i}][${j}] = dp[${i - 1}][${j}] + dp[${i}][${j - 1}] = ${dp[i - 1][j]} + ${dp[i][j - 1]} = ${dp[i][j]}`
      };
    }
  }

  yield {
    data: { type: 'matrix', value: dp.map(r => [...r]) },
    highlights: { matrixCells: [[m - 1, n - 1]], computedCells: [], compareCells: [] },
    variables: {
      dp: dp.map(r => [...r]),
      m, n,
      result: dp[m - 1][n - 1],
      complete: true,
      rowLabels: ['0', '1', '2'],
      colLabels: ['0', '1', '2']
    },
    description: `计算完成！${m}x${n}网格中共有 ${dp[m - 1][n - 1]} 条不同路径。`
  };
}

const code = [
  'function uniquePaths(m, n) {',
  '  const dp = Array.from({length: m}, () => Array(n).fill(1));',
  '',
  '  for (let i = 1; i < m; i++) {',
  '    for (let j = 1; j < n; j++) {',
  '      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];',
  '    }',
  '  }',
  '',
  '  return dp[m - 1][n - 1];',
  '}'
];

module.exports = { meta, steps, code };
