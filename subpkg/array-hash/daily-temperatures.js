const meta = {
  id: 'daily-temperatures',
  name: '每日温度',
  nameEn: 'Daily Temperatures',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['单调栈', '数组', '栈'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '每日温度问题：给定一个整数数组 temperatures 表示每天的温度，返回一个数组 answer，其中 answer[i] 表示在第 i 天之后，需要等多少天才能遇到更高的温度。如果之后没有更高的温度，则为 0。使用单调栈解决。',
  defaultInput: {
    type: 'array',
    value: [73, 74, 75, 71, 69, 72, 76, 73],
    label: '温度: [73,74,75,71,69,72,76,73]'
  }
};

function* steps(input) {
  const temperatures = [73, 74, 75, 71, 69, 72, 76, 73];
  const n = temperatures.length;
  const result = Array(n).fill(0);
  const stack = [];

  yield {
    data: { type: 'array', value: [...temperatures] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { temperatures: [...temperatures], result: [...result], stack: [...stack], phase: 'init' },
    description: `温度: [${temperatures.join(', ')}]。使用单调栈计算每个温度等待天数。`
  };

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const prevDay = stack.pop();
      result[prevDay] = i - prevDay;

      yield {
        data: { type: 'array', value: [...temperatures] },
        highlights: { dataIndices: [prevDay, i], sortedIndices: [] },
        variables: {
          temperatures: [...temperatures],
          result: [...result],
          stack: [...stack],
          prevDay,
          i,
          prevTemp: temperatures[prevDay],
          currentTemp: temperatures[i],
          waitDays: result[prevDay],
          phase: 'found'
        },
        description: `第${prevDay}天(${temperatures[prevDay]}度) -> 第${i}天(${temperatures[i]}度)，等待${result[prevDay]}天。`
      };
    }

    stack.push(i);

    yield {
      data: { type: 'array', value: [...temperatures] },
      highlights: { dataIndices: [i], sortedIndices: [] },
      variables: {
        temperatures: [...temperatures],
        result: [...result],
        stack: [...stack],
        i,
        phase: 'push'
      },
      description: `第${i}天(${temperatures[i]}度)入栈。栈: [${stack.join(', ')}] -> 温度: [${stack.map(idx => temperatures[idx]).join(', ')}]`
    };
  }

  yield {
    data: { type: 'array', value: [...temperatures] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      temperatures: [...temperatures],
      result: [...result],
      stack: [...stack],
      complete: true
    },
    description: `计算完成！等待天数: [${result.join(', ')}]`
  };
}

const code = [
  'function dailyTemperatures(temperatures) {',
  '  const n = temperatures.length;',
  '  const result = new Array(n).fill(0);',
  '  const stack = [];',
  '',
  '  for (let i = 0; i < n; i++) {',
  '    while (stack.length > 0 &&',
  '      temperatures[stack[stack.length - 1]] < temperatures[i]) {',
  '      const prevDay = stack.pop();',
  '      result[prevDay] = i - prevDay;',
  '    }',
  '    stack.push(i);',
  '  }',
  '',
  '  return result;',
  '}'
];

module.exports = { meta, steps, code };
