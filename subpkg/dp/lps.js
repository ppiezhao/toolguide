const meta = {
  id: 'lps',
  name: '最长回文子串',
  nameEn: 'Longest Palindromic Substring',
  difficulty: 'medium',
  category: 'dp',
  tags: ['回文串', '动态规划', '字符串', '子串'],
  timeComplexity: 'O(n^2)',
  spaceComplexity: 'O(n^2)',
  description: '最长回文子串问题是在给定字符串中找到最长的回文子串。回文串是正着读和反着读都一样的字符串。可以使用中心扩展法或动态规划来解决。这里使用DP方法，dp[i][j]表示子串s[i..j]是否为回文。',
  defaultInput: {
    type: 'array',
    value: ['babad'],
    label: '字符串: "babad"'
  }
};

function* steps(input) {
  const s = Array.isArray(input) ? input[0] : input;
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(false));
  let start = 0;
  let maxLen = 1;

  const rowLabels = s.split('');
  const colLabels = s.split('');

  // 单个字符都是回文
  for (let i = 0; i < n; i++) {
    dp[i][i] = true;
  }

  yield {
    data: { type: 'matrix', value: dp.map(r => r.map(v => v ? 1 : 0)) },
    highlights: { matrixCells: [], computedCells: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]], compareCells: [] },
    variables: { dp: dp.map(r => [...r]), s, n, start, maxLen, phase: 'init', rowLabels, colLabels },
    description: `初始化：单个字符都是回文。字符串="${s}"，长度=${n}。`
  };

  // 长度为2的子串
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === s[i + 1]) {
      dp[i][i + 1] = true;
      start = i;
      maxLen = 2;
    }
  }

  yield {
    data: { type: 'matrix', value: dp.map(r => r.map(v => v ? 1 : 0)) },
    highlights: { matrixCells: [], computedCells: Array.from({ length: n - 1 }, (_, i) => [i, i + 1]).filter(([i, j]) => dp[i][j]), compareCells: [] },
    variables: { dp: dp.map(r => [...r]), s, n, start, maxLen, phase: 'len2', rowLabels, colLabels },
    description: `检查长度为2的子串：${Array.from({ length: n - 1 }, (_, i) => `"${s[i]}${s[i + 1]}"`).join(', ')}。当前最长回文="${s.substring(start, start + maxLen)}"`
  };

  // 长度 >= 3
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;

      if (s[i] === s[j] && dp[i + 1][j - 1]) {
        dp[i][j] = true;
        start = i;
        maxLen = len;

        yield {
          data: { type: 'matrix', value: dp.map(r => r.map(v => v ? 1 : 0)) },
          highlights: { matrixCells: [[i, j]], computedCells: [[i + 1, j - 1]], compareCells: [] },
          variables: {
            dp: dp.map(r => [...r]),
            s, n, i, j, len,
            subStr: s.substring(i, j + 1),
            isPalin: true,
            start, maxLen,
            longest: s.substring(start, start + maxLen),
            rowLabels, colLabels
          },
          description: `"${s.substring(i, j + 1)}" 是回文！s[${i}]='${s[i]}' == s[${j}]='${s[j]}' 且内部子串是回文。`
        };
      } else {

        yield {
          data: { type: 'matrix', value: dp.map(r => r.map(v => v ? 1 : 0)) },
          highlights: { matrixCells: [[i, j]], computedCells: [[i + 1, j - 1]], compareCells: [] },
          variables: {
            dp: dp.map(r => [...r]),
            s, n, i, j, len,
            subStr: s.substring(i, j + 1),
            isPalin: false,
            start, maxLen,
            longest: s.substring(start, start + maxLen),
            rowLabels, colLabels
          },
          description: `"${s.substring(i, j + 1)}" 不是回文。s[${i}]='${s[i]}' ${s[i] === s[j] ? '==' : '!='} s[${j}]='${s[j]}'${s[i] === s[j] ? ' 但内部子串不是回文' : ''}`
        };
      }
    }
  }

  yield {
    data: { type: 'matrix', value: dp.map(r => r.map(v => v ? 1 : 0)) },
    highlights: { matrixCells: [], computedCells: [], compareCells: [] },
    variables: {
      dp: dp.map(r => [...r]),
      s,
      n,
      start,
      maxLen,
      longest: s.substring(start, start + maxLen),
      complete: true,
      rowLabels, colLabels
    },
    description: `计算完成！最长回文子串="${s.substring(start, start + maxLen)}"，长度=${maxLen}`
  };
}

const code = [
  'function longestPalindrome(s) {',
  '  const n = s.length;',
  '  const dp = Array.from({length: n}, () => Array(n).fill(false));',
  '  let start = 0, maxLen = 1;',
  '',
  '  for (let i = 0; i < n; i++) dp[i][i] = true;',
  '',
  '  for (let i = 0; i < n - 1; i++) {',
  '    if (s[i] === s[i + 1]) {',
  '      dp[i][i + 1] = true;',
  '      start = i; maxLen = 2;',
  '    }',
  '  }',
  '',
  '  for (let len = 3; len <= n; len++) {',
  '    for (let i = 0; i <= n - len; i++) {',
  '      const j = i + len - 1;',
  '      if (s[i] === s[j] && dp[i + 1][j - 1]) {',
  '        dp[i][j] = true;',
  '        start = i; maxLen = len;',
  '      }',
  '    }',
  '  }',
  '',
  '  return s.substring(start, start + maxLen);',
  '}'
];

module.exports = { meta, steps, code };
