const meta = {
  id: 'word-break',
  name: '单词拆分',
  nameEn: 'Word Break',
  difficulty: 'medium',
  category: 'dp',
  tags: ['单词拆分', '动态规划', '字符串', '哈希表'],
  timeComplexity: 'O(n^2)',
  spaceComplexity: 'O(n)',
  description: '单词拆分问题：给定一个字符串和一个单词字典，判断是否可以将字符串分割成一个或多个字典中出现的单词。使用动态规划，dp[i]表示字符串前i个字符是否可以被成功拆分。',
  defaultInput: {
    type: 'array',
    value: [['leet', 'code'], 'leetcode'],
    label: '字符串: "leetcode", 字典: ["leet","code"]'
  }
};

function* steps(input) {
  const s = 'leetcode';
  const wordDict = ['leet', 'code'];
  const n = s.length;
  const dp = Array(n + 1).fill(false);
  dp[0] = true;

  yield {
    data: { type: 'array', value: [...dp.map(v => v ? 1 : 0)] },
    highlights: { dataIndices: [0], sortedIndices: [] },
    variables: { dp: dp.map(v => v ? 1 : 0), s, wordDict, n, phase: 'init' },
    description: `初始化：dp[0]=true（空字符串），字符串="${s}"，字典=${JSON.stringify(wordDict)}`
  };

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      const word = s.substring(j, i);

      if (dp[j] && wordDict.includes(word)) {
        dp[i] = true;

        yield {
          data: { type: 'array', value: [...dp.map(v => v ? 1 : 0)] },
          highlights: { dataIndices: [i, j], sortedIndices: [i] },
          variables: {
            dp: dp.map(v => v ? 1 : 0),
            s, wordDict, n,
            i, j,
            word,
            found: true,
            phase: 'match'
          },
          description: `找到匹配！s[${j}..${i - 1}]="${word}" 在字典中，dp[${i}]=true。`
        };
        break;
      }
    }

    if (!dp[i]) {
      yield {
        data: { type: 'array', value: [...dp.map(v => v ? 1 : 0)] },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          dp: dp.map(v => v ? 1 : 0),
          s, wordDict, n,
          i,
          found: false,
          phase: 'no_match'
        },
        description: `位置 ${i}（"${s.substring(0, i)}"）：无法用字典中的单词拆分。`
      };
    }
  }

  yield {
    data: { type: 'array', value: [...dp.map(v => v ? 1 : 0)] },
    highlights: { dataIndices: [n], sortedIndices: dp.map((v, i) => v ? i : -1).filter(v => v >= 0) },
    variables: {
      dp: dp.map(v => v ? 1 : 0),
      s, wordDict, n,
      result: dp[n],
      complete: true
    },
    description: dp[n]
      ? `单词拆分成功！"${s}" 可以被拆分为字典中的单词。`
      : `单词拆分失败！"${s}" 无法被拆分为字典中的单词。`
  };
}

const code = [
  'function wordBreak(s, wordDict) {',
  '  const wordSet = new Set(wordDict);',
  '  const dp = new Array(s.length + 1).fill(false);',
  '  dp[0] = true;',
  '',
  '  for (let i = 1; i <= s.length; i++) {',
  '    for (let j = 0; j < i; j++) {',
  '      const word = s.substring(j, i);',
  '      if (dp[j] && wordSet.has(word)) {',
  '        dp[i] = true;',
  '        break;',
  '      }',
  '    }',
  '  }',
  '',
  '  return dp[s.length];',
  '}'
];

module.exports = { meta, steps, code };
