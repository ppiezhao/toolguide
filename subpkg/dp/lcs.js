const meta = {
  id: 'lcs',
  name: '最长公共子序列',
  nameEn: 'Longest Common Subsequence',
  difficulty: 'medium',
  category: 'dp',
  tags: ['LCS', '动态规划', '字符串', '子序列'],
  timeComplexity: 'O(m * n)',
  spaceComplexity: 'O(m * n)',
  description: '最长公共子序列（LCS）问题是找出两个字符串的最长公共子序列的长度。子序列是指从原字符串中删除一些字符（或不删除）后得到的新字符串，不改变剩余字符的相对顺序。使用二维DP表递推求解。',
  defaultInput: {
    type: 'matrix',
    value: [
      ['A', 'B', 'C', 'D', 'G', 'H'],
      ['A', 'E', 'D', 'F', 'H', 'R']
    ],
    label: '字符串1: "ABCDGH", 字符串2: "AEDFHR"'
  }
};

function* steps(input) {
  const text1 = 'ABCDGH';
  const text2 = 'AEDFHR';
  const m = text1.length;
  const n = text2.length;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  const rowLabels = ['', ...text1.split('')];
  const colLabels = ['', ...text2.split('')];

  yield {
    data: { type: 'matrix', value: dp.map(r => [...r]) },
    highlights: { matrixCells: [], computedCells: [], compareCells: [] },
    variables: { dp: dp.map(r => [...r]), text1, text2, phase: 'init', rowLabels, colLabels },
    description: `初始化LCS DP表：字符串1="${text1}"（长度${m}），字符串2="${text2}"（长度${n}）。dp[0][*]=dp[*][0]=0。`
  };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;

        yield {
          data: { type: 'matrix', value: dp.map(r => [...r]) },
          highlights: { matrixCells: [[i, j]], computedCells: [[i - 1, j - 1]], compareCells: [[i, j - 1], [i - 1, j]] },
          variables: {
            dp: dp.map(r => [...r]),
            i, j,
            char1: text1[i - 1],
            char2: text2[j - 1],
            match: true,
            rowLabels, colLabels
          },
          description: `匹配！text1[${i - 1}]='${text1[i - 1]}' === text2[${j - 1}]='${text2[j - 1]}'，dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`
        };
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);

        yield {
          data: { type: 'matrix', value: dp.map(r => [...r]) },
          highlights: { matrixCells: [[i, j]], computedCells: [[i - 1, j], [i, j - 1]], compareCells: [[i - 1, j - 1]] },
          variables: {
            dp: dp.map(r => [...r]),
            i, j,
            char1: text1[i - 1],
            char2: text2[j - 1],
            match: false,
            fromTop: dp[i - 1][j],
            fromLeft: dp[i][j - 1],
            selected: dp[i - 1][j] >= dp[i][j - 1] ? '上' : '左',
            rowLabels, colLabels
          },
          description: `不匹配：'${text1[i - 1]}' != '${text2[j - 1]}'，取max(上=${dp[i - 1][j]}, 左=${dp[i][j - 1]}) = ${dp[i][j]}`
        };
      }
    }
  }

  const lcsLength = dp[m][n];

  // 回溯找LCS字符串
  let lcsStr = '';
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      lcsStr = text1[i - 1] + lcsStr;
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  yield {
    data: { type: 'matrix', value: dp.map(r => [...r]) },
    highlights: { matrixCells: [], computedCells: [], compareCells: [] },
    variables: {
      dp: dp.map(r => [...r]),
      text1, text2,
      lcsLength,
      lcsStr,
      complete: true,
      rowLabels, colLabels
    },
    description: `LCS计算完成！最长公共子序列长度=${lcsLength}，子序列="${lcsStr}"`
  };
}

const code = [
  'function longestCommonSubsequence(text1, text2) {',
  '  const m = text1.length, n = text2.length;',
  '  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));',
  '',
  '  for (let i = 1; i <= m; i++) {',
  '    for (let j = 1; j <= n; j++) {',
  '      if (text1[i - 1] === text2[j - 1]) {',
  '        dp[i][j] = dp[i - 1][j - 1] + 1;',
  '      } else {',
  '        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);',
  '      }',
  '    }',
  '  }',
  '',
  '  return dp[m][n];',
  '}'
];

module.exports = { meta, steps, code };
