const meta = {
  id: 'climbing-stairs',
  name: '爬楼梯',
  nameEn: 'Climbing Stairs',
  difficulty: 'easy',
  category: 'dp',
  tags: ['爬楼梯', '动态规划', '斐波那契'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n) / O(1)',
  description: '爬楼梯问题：每次可以爬 1 或 2 个台阶，计算爬到第 n 阶有多少种不同的方法。这是一个典型的动态规划问题，递推关系为 f(n) = f(n-1) + f(n-2)，本质上是斐波那契数列。',
  defaultInput: {
    type: 'array',
    value: [5],
    label: '爬楼梯: n=5'
  }
};

function* steps(input) {
  const n = Array.isArray(input) ? input[0] : input;
  const dp = [0, 1, 2];

  if (n <= 2) {
    return dp[n];
  }

  yield {
    data: { type: 'array', value: [...dp] },
    highlights: { dataIndices: [0, 1, 2], sortedIndices: [] },
    variables: { dp: [...dp], n, phase: 'init' },
    description: `初始化：dp[0]=0（起点），dp[1]=1（1种方法到第1阶），dp[2]=2（2种方法到第2阶）。`
  };

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];

    yield {
      data: { type: 'array', value: [...dp] },
      highlights: { dataIndices: [i, i - 1, i - 2], sortedIndices: [] },
      variables: {
        dp: [...dp],
        n,
        i,
        prev1: dp[i - 1],
        prev2: dp[i - 2],
        formula: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`
      },
      description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`
    };
  }

  yield {
    data: { type: 'array', value: [...dp] },
    highlights: { dataIndices: [n], sortedIndices: Array.from({ length: n + 1 }, (_, i) => i) },
    variables: {
      dp: [...dp],
      n,
      result: dp[n],
      complete: true
    },
    description: `爬楼梯完成！爬到第 ${n} 阶共有 ${dp[n]} 种不同的方法。`
  };
}

const code = [
  'function climbStairs(n) {',
  '  if (n <= 2) return n;',
  '  let a = 1, b = 2;',
  '  for (let i = 3; i <= n; i++) {',
  '    const c = a + b;',
  '    a = b;',
  '    b = c;',
  '  }',
  '  return b;',
  '}'
];

module.exports = { meta, steps, code };
