const meta = {
  id: 'longest-palindrome',
  name: '最长回文子串（中心扩展）',
  nameEn: 'Longest Palindromic Substring (Expand Around Center)',
  difficulty: 'medium',
  category: 'dp',
  tags: ['回文串', '中心扩展', '字符串'],
  timeComplexity: 'O(n^2)',
  spaceComplexity: 'O(1)',
  description: '最长回文子串问题的中心扩展解法。回文串的中心可以是一个字符（奇数长度）或两个字符之间（偶数长度）。遍历每个可能的中心位置，向两边扩展检查回文。该方法比DP更节省空间。',
  defaultInput: {
    type: 'array',
    value: ['babad'],
    label: '字符串: "babad"'
  }
};

function* steps(input) {
  const s = Array.isArray(input) ? input[0] : input;
  const n = s.length;

  let start = 0;
  let maxLen = 1;
  let expandCount = 0;

  yield {
    data: { type: 'array', value: s.split('') },
    highlights: { dataIndices: [], sortedIndices: [0] },
    variables: { s, n, start, maxLen, longest: s[0], expandCount, phase: 'init' },
    description: `字符串="${s}"，长度=${n}。初始化最长回文="${s[0]}"，开始中心扩展。`
  };

  function* expandAroundCenter(left, right) {
    while (left >= 0 && right < n && s[left] === s[right]) {
      expandCount++;
      const currentLen = right - left + 1;

      yield {
        data: { type: 'array', value: s.split('') },
        highlights: {
          dataIndices: [],
          sortedIndices: Array.from({ length: currentLen }, (_, i) => left + i)
        },
        variables: {
          s, n,
          left, right,
          centerLeft: left,
          centerRight: right,
          currentLen,
          start, maxLen,
          longest: s.substring(start, start + maxLen),
          expandCount,
          phase: 'expanding',
          expanding: s.substring(left, right + 1)
        },
        description: `中心 [${left},${right}] 扩展：检查 "${s.substring(left, right + 1)}"，长度=${currentLen}${currentLen > maxLen ? '，发现更长回文！' : ''}`
      };

      if (currentLen > maxLen) {
        start = left;
        maxLen = currentLen;
      }

      left--;
      right++;
    }
  }

  for (let i = 0; i < n; i++) {
    // 奇数长度中心
    yield {
      data: { type: 'array', value: s.split('') },
      highlights: { dataIndices: [i], sortedIndices: Array.from({ length: maxLen }, (_, j) => start + j) },
      variables: {
        s, n, i,
        center: i,
        type: 'odd',
        start, maxLen,
        longest: s.substring(start, start + maxLen),
        expandCount,
        phase: 'center_odd'
      },
      description: `奇数中心：s[${i}]='${s[i]}'，开始向两边扩展。`
    };

    yield* expandAroundCenter(i, i);

    // 偶数长度中心
    if (i + 1 < n) {
      yield {
        data: { type: 'array', value: s.split('') },
        highlights: { dataIndices: [i, i + 1], sortedIndices: Array.from({ length: maxLen }, (_, j) => start + j) },
        variables: {
          s, n, i,
          center: `${i},${i + 1}`,
          type: 'even',
          start, maxLen,
          longest: s.substring(start, start + maxLen),
          expandCount,
          phase: 'center_even'
        },
        description: `偶数中心：s[${i}]='${s[i]}'和s[${i + 1}]='${s[i + 1]}'，开始向两边扩展。`
      };

      yield* expandAroundCenter(i, i + 1);
    }
  }

  yield {
    data: { type: 'array', value: s.split('') },
    highlights: {
      dataIndices: [Math.floor((start + start + maxLen - 1) / 2)],
      sortedIndices: Array.from({ length: maxLen }, (_, i) => start + i)
    },
    variables: {
      s, n,
      start, maxLen,
      longest: s.substring(start, start + maxLen),
      expandCount,
      complete: true
    },
    description: `计算完成！最长回文子串="${s.substring(start, start + maxLen)}"，长度=${maxLen}。共进行了 ${expandCount} 次扩展检查。`
  };
}

const code = [
  'function longestPalindrome(s) {',
  '  if (!s || s.length < 1) return "";',
  '  let start = 0, maxLen = 1;',
  '',
  '  function expandAroundCenter(left, right) {',
  '    while (left >= 0 && right < s.length && s[left] === s[right]) {',
  '      if (right - left + 1 > maxLen) {',
  '        start = left;',
  '        maxLen = right - left + 1;',
  '      }',
  '      left--;',
  '      right++;',
  '    }',
  '  }',
  '',
  '  for (let i = 0; i < s.length; i++) {',
  '    expandAroundCenter(i, i);',
  '    expandAroundCenter(i, i + 1);',
  '  }',
  '',
  '  return s.substring(start, start + maxLen);',
  '}'
];

module.exports = { meta, steps, code };
