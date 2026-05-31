const meta = {
  id: 'coin-change',
  name: '零钱兑换',
  nameEn: 'Coin Change',
  difficulty: 'medium',
  category: 'dp',
  tags: ['零钱兑换', '动态规划', '完全背包'],
  timeComplexity: 'O(n * amount)',
  spaceComplexity: 'O(amount)',
  description: '零钱兑换问题：给定不同面额的硬币和一个总金额，计算可以凑成总金额所需的最少硬币个数。如果没有任何一种硬币组合能组成总金额，返回-1。每种硬币的数量是无限的（完全背包问题）。',
  defaultInput: {
    type: 'array',
    value: [[1, 2, 5], 11],
    label: '硬币面额: [1,2,5], 目标金额: 11'
  }
};

function* steps(input) {
  const coins = [1, 2, 5];
  const amount = 11;
  const INF = amount + 1;
  const dp = Array(amount + 1).fill(INF);
  dp[0] = 0;

  yield {
    data: { type: 'array', value: [...dp.map(v => v === INF ? '∞' : v)] },
    highlights: { dataIndices: [0], sortedIndices: [] },
    variables: { dp: [...dp], coins, amount, phase: 'init' },
    description: `初始化dp数组，dp[0]=0，其余为∞。硬币: [${coins.join(', ')}]，目标金额: ${amount}`
  };

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        const candidate = dp[i - coin] + 1;
        if (candidate < dp[i]) {
          dp[i] = candidate;

          yield {
            data: { type: 'array', value: [...dp.map(v => v === INF ? '∞' : v)] },
            highlights: { dataIndices: [i, i - coin], sortedIndices: [] },
            variables: {
              dp: [...dp],
              coins,
              amount,
              i,
              coin,
              candidate,
              phase: 'update'
            },
            description: `金额 ${i}：使用硬币 ${coin}，dp[${i}] = dp[${i - coin}] + 1 = ${dp[i - coin]} + 1 = ${candidate}`
          };
        }
      }
    }

    if (dp[i] === INF) {
      yield {
        data: { type: 'array', value: [...dp.map(v => v === INF ? '∞' : v)] },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          dp: [...dp],
          coins,
          amount,
          i,
          phase: 'unreachable'
        },
        description: `金额 ${i} 无法用现有硬币凑出，dp[${i}]保持∞。`
      };
    }
  }

  const result = dp[amount] === INF ? -1 : dp[amount];

  // 找零方案重构
  let remaining = amount;
  const usedCoins = [];
  if (result !== -1) {
    while (remaining > 0) {
      for (const coin of coins) {
        if (coin <= remaining && dp[remaining] === dp[remaining - coin] + 1) {
          usedCoins.push(coin);
          remaining -= coin;
          break;
        }
      }
    }
  }

  yield {
    data: { type: 'array', value: [...dp.map(v => v === INF ? '∞' : v)] },
    highlights: { dataIndices: [amount], sortedIndices: result !== -1 ? Array.from({ length: amount + 1 }, (_, i) => i) : [] },
    variables: {
      dp: [...dp],
      coins,
      amount,
      result,
      usedCoins,
      complete: true
    },
    description: result !== -1
      ? `计算完成！最少需要 ${result} 个硬币凑成 ${amount}：${usedCoins.join(' + ')} = ${amount}`
      : `无法用 [${coins.join(',')}] 凑出金额 ${amount}`
  };
}

const code = [
  'function coinChange(coins, amount) {',
  '  const dp = new Array(amount + 1).fill(amount + 1);',
  '  dp[0] = 0;',
  '',
  '  for (let i = 1; i <= amount; i++) {',
  '    for (const coin of coins) {',
  '      if (coin <= i) {',
  '        dp[i] = Math.min(dp[i], dp[i - coin] + 1);',
  '      }',
  '    }',
  '  }',
  '',
  '  return dp[amount] > amount ? -1 : dp[amount];',
  '}'
];

module.exports = { meta, steps, code };
