const meta = {
  id: 'knapsack',
  name: '0-1背包问题',
  nameEn: '0-1 Knapsack Problem',
  difficulty: 'medium',
  category: 'dp',
  tags: ['背包问题', '动态规划', '组合优化'],
  timeComplexity: 'O(n * W)',
  spaceComplexity: 'O(n * W)',
  description: '0-1背包问题是动态规划的经典问题：给定一组物品，每个物品有重量和价值，在总容量限制下选择物品使得总价值最大。每个物品只能选择0个或1个。使用二维DP表，dp[i][w]表示前i个物品在容量w下的最大价值。',
  defaultInput: {
    type: 'matrix',
    value: [
      [60, 1],
      [100, 2],
      [120, 3]
    ],
    label: '物品(价值,重量): (60,1), (100,2), (120,3), 容量=5'
  }
};

function* steps(input) {
  const items = [
    { value: 60, weight: 1, label: '物品1' },
    { value: 100, weight: 2, label: '物品2' },
    { value: 120, weight: 3, label: '物品3' }
  ];
  const capacity = 5;
  const n = items.length;

  // DP表: dp[i][w], i表示前i个物品, w表示容量
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  yield {
    data: { type: 'matrix', value: dp.map(r => [...r]) },
    highlights: { matrixCells: [], computedCells: [], compareCells: [] },
    variables: { dp: dp.map(r => [...r]), capacity, items, phase: 'init', rowLabels: ['0', '1', '2', '3'], colLabels: ['0', '1', '2', '3', '4', '5'] },
    description: `初始化DP表：dp[0][w]=0，表示没有物品时价值为0。容量=5，物品: ${items.map(i => `${i.label}(v=${i.value},w=${i.weight})`).join(', ')}`
  };

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];

    for (let w = 0; w <= capacity; w++) {
      if (item.weight <= w) {
        const include = item.value + dp[i - 1][w - item.weight];
        const exclude = dp[i - 1][w];
        dp[i][w] = Math.max(include, exclude);

        yield {
          data: { type: 'matrix', value: dp.map(r => [...r]) },
          highlights: { matrixCells: [[i, w]], computedCells: [[i - 1, w], [i - 1, w - item.weight]], compareCells: [] },
          variables: {
            dp: dp.map(r => [...r]),
            i,
            w,
            item: item.label,
            itemValue: item.value,
            itemWeight: item.weight,
            include: include,
            exclude: exclude,
            selected: include >= exclude ? '放入' : '不放入',
            phase: 'compute',
            rowLabels: ['0', '1', '2', '3'],
            colLabels: ['0', '1', '2', '3', '4', '5']
          },
          description: `dp[${i}][${w}]：${item.label}(v=${item.value},w=${item.weight})，放入=${include}，不放入=${exclude}，选择${include >= exclude ? '放入' : '不放入'}。`
        };
      } else {
        dp[i][w] = dp[i - 1][w];

        yield {
          data: { type: 'matrix', value: dp.map(r => [...r]) },
          highlights: { matrixCells: [[i, w]], computedCells: [[i - 1, w]], compareCells: [] },
          variables: {
            dp: dp.map(r => [...r]),
            i,
            w,
            item: item.label,
            itemWeight: item.weight,
            phase: 'skip',
            rowLabels: ['0', '1', '2', '3'],
            colLabels: ['0', '1', '2', '3', '4', '5']
          },
          description: `dp[${i}][${w}]：${item.label}重量=${item.weight} > 容量=${w}，无法放入，继承dp[${i - 1}][${w}]=${dp[i][w]}。`
        };
      }
    }
  }

  const maxValue = dp[n][capacity];

  // 回溯找出选择了哪些物品
  const selected = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.unshift(i);
      w -= items[i - 1].weight;
    }
  }

  yield {
    data: { type: 'matrix', value: dp.map(r => [...r]) },
    highlights: { matrixCells: [[n, capacity]], computedCells: [], compareCells: [] },
    variables: {
      dp: dp.map(r => [...r]),
      maxValue,
      selected: selected.map(i => items[i - 1].label),
      selectedIndices: selected,
      totalWeight: selected.reduce((sum, i) => sum + items[i - 1].weight, 0),
      complete: true,
      rowLabels: ['0', '1', '2', '3'],
      colLabels: ['0', '1', '2', '3', '4', '5']
    },
    description: `计算完成！最大价值=${maxValue}，选择的物品: ${selected.map(i => items[i - 1].label).join(', ')}，总重量=${selected.reduce((sum, i) => sum + items[i - 1].weight, 0)}`
  };
}

const code = [
  'function knapsack(values, weights, capacity) {',
  '  const n = values.length;',
  '  const dp = Array.from({length: n + 1}, () => Array(capacity + 1).fill(0));',
  '',
  '  for (let i = 1; i <= n; i++) {',
  '    for (let w = 0; w <= capacity; w++) {',
  '      if (weights[i - 1] <= w) {',
  '        dp[i][w] = Math.max(',
  '          values[i - 1] + dp[i - 1][w - weights[i - 1]],',
  '          dp[i - 1][w]',
  '        );',
  '      } else {',
  '        dp[i][w] = dp[i - 1][w];',
  '      }',
  '    }',
  '  }',
  '',
  '  return dp[n][capacity];',
  '}'
];

module.exports = { meta, steps, code };
