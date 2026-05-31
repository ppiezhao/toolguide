const meta = {
  id: 'edit-distance',
  name: '编辑距离',
  nameEn: 'Edit Distance (Levenshtein Distance)',
  difficulty: 'hard',
  category: 'dp',
  tags: ['编辑距离', 'Levenshtein', '动态规划', '字符串'],
  timeComplexity: 'O(m * n)',
  spaceComplexity: 'O(m * n)',
  description: '编辑距离（Levenshtein距离）是衡量两个字符串差异的指标，定义为将一个字符串转换成另一个字符串所需的最少编辑操作次数。允许的操作包括：插入一个字符、删除一个字符、替换一个字符。',
  defaultInput: {
    type: 'matrix',
    value: [['h', 'o', 'r', 's', 'e'], ['r', 'o', 's']],
    label: '字符串1: "horse", 字符串2: "ros"'
  }
};

function* steps(input) {
  const word1 = 'horse';
  const word2 = 'ros';
  const m = word1.length;
  const n = word2.length;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  const rowLabels = ['', ...word1.split('')];
  const colLabels = ['', ...word2.split('')];

  yield {
    data: { type: 'matrix', value: dp.map(r => [...r]) },
    highlights: { matrixCells: [], computedCells: [], compareCells: [] },
    variables: { dp: dp.map(r => [...r]), word1, word2, phase: 'init', rowLabels, colLabels },
    description: `初始化编辑距离DP表：word1="${word1}"（${m}字符），word2="${word2}"（${n}字符）。第1行列表示删除操作。`
  };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];

        yield {
          data: { type: 'matrix', value: dp.map(r => [...r]) },
          highlights: { matrixCells: [[i, j]], computedCells: [[i - 1, j - 1]], compareCells: [[i - 1, j], [i, j - 1]] },
          variables: {
            dp: dp.map(r => [...r]),
            i, j,
            char1: word1[i - 1],
            char2: word2[j - 1],
            match: true,
            cost: dp[i][j],
            rowLabels, colLabels
          },
          description: `字符匹配：'${word1[i - 1]}' == '${word2[j - 1]}'，直接继承左上角 dp[${i}][${j}] = ${dp[i][j]}`
        };
      } else {
        const insertCost = dp[i][j - 1] + 1;
        const deleteCost = dp[i - 1][j] + 1;
        const replaceCost = dp[i - 1][j - 1] + 1;
        dp[i][j] = Math.min(insertCost, deleteCost, replaceCost);

        const minOp = insertCost <= deleteCost && insertCost <= replaceCost ? '插入' :
                      deleteCost <= replaceCost ? '删除' : '替换';

        yield {
          data: { type: 'matrix', value: dp.map(r => [...r]) },
          highlights: { matrixCells: [[i, j]], computedCells: [[i - 1, j], [i, j - 1], [i - 1, j - 1]], compareCells: [] },
          variables: {
            dp: dp.map(r => [...r]),
            i, j,
            char1: word1[i - 1],
            char2: word2[j - 1],
            match: false,
            insertCost,
            deleteCost,
            replaceCost,
            minCost: dp[i][j],
            minOp,
            rowLabels, colLabels
          },
          description: `字符不匹配：'${word1[i - 1]}' != '${word2[j - 1]}'，min(插入=${insertCost}, 删除=${deleteCost}, 替换=${replaceCost}) = ${dp[i][j]}，选择${minOp}。`
        };
      }
    }
  }

  const distance = dp[m][n];

  yield {
    data: { type: 'matrix', value: dp.map(r => [...r]) },
    highlights: { matrixCells: [[m, n]], computedCells: [], compareCells: [] },
    variables: {
      dp: dp.map(r => [...r]),
      word1, word2,
      distance,
      complete: true,
      rowLabels, colLabels
    },
    description: `编辑距离计算完成！将"${word1}"转换为"${word2}"需要 ${distance} 次操作。`
  };
}

const code = [
  'function minDistance(word1, word2) {',
  '  const m = word1.length, n = word2.length;',
  '  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));',
  '',
  '  for (let i = 0; i <= m; i++) dp[i][0] = i;',
  '  for (let j = 0; j <= n; j++) dp[0][j] = j;',
  '',
  '  for (let i = 1; i <= m; i++) {',
  '    for (let j = 1; j <= n; j++) {',
  '      if (word1[i - 1] === word2[j - 1]) {',
  '        dp[i][j] = dp[i - 1][j - 1];',
  '      } else {',
  '        dp[i][j] = Math.min(',
  '          dp[i - 1][j] + 1,',
  '          dp[i][j - 1] + 1,',
  '          dp[i - 1][j - 1] + 1',
  '        );',
  '      }',
  '    }',
  '  }',
  '',
  '  return dp[m][n];',
  '}'
];

module.exports = { meta, steps, code };
