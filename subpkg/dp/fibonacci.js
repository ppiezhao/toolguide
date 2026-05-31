const meta = {
  id: 'fibonacci',
  name: '斐波那契数列',
  nameEn: 'Fibonacci Sequence',
  difficulty: 'easy',
  category: 'dp',
  tags: ['斐波那契', '动态规划', '递推'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n) / O(1)',
  description: '斐波那契数列是一个经典的动态规划入门问题。数列定义为 F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)。使用自底向上的DP方法，从基础情况开始逐步计算到目标值。',
  defaultInput: {
    type: 'array',
    value: [8],
    label: '计算第n个斐波那契数: n=8'
  }
};

function* steps(input) {
  const n = Array.isArray(input) ? input[0] : input;
  const dp = [0, 1];

  yield {
    data: { type: 'array', value: [...dp] },
    highlights: { dataIndices: [0, 1], sortedIndices: [] },
    variables: { dp: [...dp], n, i: 0, phase: 'init' },
    description: `初始化DP数组：F(0)=0, F(1)=1。`
  };

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];

    yield {
      data: { type: 'array', value: [...dp] },
      highlights: { dataIndices: [i], sortedIndices: [] },
      variables: {
        dp: [...dp],
        n,
        i,
        prev1: dp[i - 1],
        prev2: dp[i - 2],
        formula: `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`
      },
      description: `计算 F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`
    };
  }

  yield {
    data: { type: 'array', value: [...dp] },
    highlights: { dataIndices: [n], sortedIndices: Array.from({ length: n + 1 }, (_, i) => i) },
    variables: { dp: [...dp], n, result: dp[n], complete: true },
    description: `计算完成！F(${n}) = ${dp[n]}。DP数组: [${dp.join(', ')}]`
  };
}

const code = [
  'function fibonacci(n) {',
  '  if (n <= 1) return n;',
  '  const dp = [0, 1];',
  '  for (let i = 2; i <= n; i++) {',
  '    dp[i] = dp[i - 1] + dp[i - 2];',
  '  }',
  '  return dp[n];',
  '}'
];

module.exports = { meta, steps, code };
