const meta = {
  id: 'best-time-stock',
  name: '买卖股票最佳时机',
  nameEn: 'Best Time to Buy and Sell Stock',
  difficulty: 'easy',
  category: 'array-hash',
  tags: ['股票', '数组', '贪心', '动态规划'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '买卖股票最佳时机问题：给定一个数组，第i个元素是股票在第i天的价格。只能买卖一次（先买后卖），计算能获得的最大利润。遍历时维护当前最低价格和最大利润。',
  defaultInput: {
    type: 'array',
    value: [7, 1, 5, 3, 6, 4],
    label: '股价: [7,1,5,3,6,4]'
  }
};

function* steps(input) {
  const prices = [7, 1, 5, 3, 6, 4];
  let minPrice = prices[0];
  let maxProfit = 0;

  yield {
    data: { type: 'array', value: [...prices] },
    highlights: { dataIndices: [0], sortedIndices: [] },
    variables: { prices: [...prices], minPrice, maxProfit, i: 0, phase: 'init' },
    description: `初始化：minPrice=prices[0]=${prices[0]}，maxProfit=0。`
  };

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];

      yield {
        data: { type: 'array', value: [...prices] },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          prices: [...prices],
          minPrice,
          maxProfit,
          i,
          currentPrice: prices[i],
          phase: 'new_min'
        },
        description: `第${i}天价格=${prices[i]}，更新最低价=${minPrice}。今天买入成本最低。`
      };
    } else {
      const profit = prices[i] - minPrice;
      if (profit > maxProfit) {
        maxProfit = profit;

        yield {
          data: { type: 'array', value: [...prices] },
          highlights: { dataIndices: [i], sortedIndices: [] },
          variables: {
            prices: [...prices],
            minPrice,
            maxProfit,
            i,
            currentPrice: prices[i],
            profit,
            buyDay: prices.indexOf(minPrice),
            phase: 'max_profit'
          },
          description: `第${i}天价格=${prices[i]}，卖出利润=${profit}（买入价=${minPrice}），更新最大利润=${maxProfit}。`
        };
      } else {
        yield {
          data: { type: 'array', value: [...prices] },
          highlights: { dataIndices: [i], sortedIndices: [] },
          variables: {
            prices: [...prices],
            minPrice,
            maxProfit,
            i,
            currentPrice: prices[i],
            profit,
            phase: 'no_update'
          },
          description: `第${i}天价格=${prices[i]}，卖出利润=${profit}，未超过当前最大利润=${maxProfit}。`
        };
      }
    }
  }

  yield {
    data: { type: 'array', value: [...prices] },
    highlights: { dataIndices: [], sortedIndices: maxProfit > 0 ? [prices.indexOf(minPrice), prices.indexOf(minPrice + maxProfit)] : [] },
    variables: {
      prices: [...prices],
      minPrice,
      maxProfit,
      buyDay: prices.indexOf(minPrice),
      sellDay: maxProfit > 0 ? prices.indexOf(minPrice + maxProfit) : -1,
      complete: true
    },
    description: maxProfit > 0
      ? `最大利润=${maxProfit}：第${prices.indexOf(minPrice)}天买入（价${minPrice}），第${prices.indexOf(minPrice + maxProfit)}天卖出（价${minPrice + maxProfit}）。`
      : '没有利润空间。'
  };
}

const code = [
  'function maxProfit(prices) {',
  '  let minPrice = prices[0];',
  '  let maxProfit = 0;',
  '',
  '  for (let i = 1; i < prices.length; i++) {',
  '    if (prices[i] < minPrice) {',
  '      minPrice = prices[i];',
  '    } else if (prices[i] - minPrice > maxProfit) {',
  '      maxProfit = prices[i] - minPrice;',
  '    }',
  '  }',
  '',
  '  return maxProfit;',
  '}'
];

module.exports = { meta, steps, code };
