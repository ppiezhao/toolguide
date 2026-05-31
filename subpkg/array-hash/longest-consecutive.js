const meta = {
  id: 'longest-consecutive',
  name: '最长连续序列',
  nameEn: 'Longest Consecutive Sequence',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['数组', '哈希表', '连续序列'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '最长连续序列问题：给定一个未排序的整数数组，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。要求时间复杂度 O(n)。使用哈希集合去重，然后只从可能的最左端点开始查找。',
  defaultInput: {
    type: 'array',
    value: [100, 4, 200, 1, 3, 2],
    label: '数组: [100,4,200,1,3,2]'
  }
};

function* steps(input) {
  const nums = [100, 4, 200, 1, 3, 2];
  const numSet = new Set(nums);
  let longestStreak = 0;

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { nums: [...nums], set: Array.from(numSet).sort((a, b) => a - b), longestStreak, phase: 'init' },
    description: `数组: [${nums.join(', ')}]。使用哈希集合去重，只从可能的最左端点开始查找。`
  };

  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      // 这是序列的起点
      let currentNum = num;
      let currentStreak = 1;

      yield {
        data: { type: 'array', value: Array.from(numSet).sort((a, b) => a - b) },
        highlights: { dataIndices: [], sortedIndices: [] },
        variables: {
          nums: [...nums],
          set: Array.from(numSet).sort((a, b) => a - b),
          currentStart: num,
          currentStreak,
          longestStreak,
          phase: 'start'
        },
        description: `发现新序列起点：${num}（${num - 1} 不在集合中）。开始查找连续序列。`
      };

      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentStreak++;

        yield {
          data: { type: 'array', value: Array.from(numSet).sort((a, b) => a - b) },
          highlights: { dataIndices: [], sortedIndices: [] },
          variables: {
            nums: [...nums],
            set: Array.from(numSet).sort((a, b) => a - b),
            currentNum,
            currentStreak,
            longestStreak,
            sequence: Array.from({ length: currentStreak }, (_, i) => num + i),
            phase: 'extend'
          },
          description: `找到 ${currentNum}，序列扩展到 [${Array.from({ length: currentStreak }, (_, i) => num + i).join(', ')}]，长度=${currentStreak}`
        };
      }

      longestStreak = Math.max(longestStreak, currentStreak);

      yield {
        data: { type: 'array', value: Array.from(numSet).sort((a, b) => a - b) },
        highlights: { dataIndices: [], sortedIndices: [] },
        variables: {
          nums: [...nums],
          set: Array.from(numSet).sort((a, b) => a - b),
          currentStart: num,
          currentStreak,
          longestStreak,
          sequence: Array.from({ length: currentStreak }, (_, i) => num + i),
          phase: 'end'
        },
        description: `序列 [${Array.from({ length: currentStreak }, (_, i) => num + i).join(', ')}] 结束，长度=${currentStreak}。当前最长=${longestStreak}。`
      };
    }
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      nums: [...nums],
      set: Array.from(numSet).sort((a, b) => a - b),
      longestStreak,
      complete: true
    },
    description: `计算完成！最长连续序列长度为 ${longestStreak}。`
  };
}

const code = [
  'function longestConsecutive(nums) {',
  '  const numSet = new Set(nums);',
  '  let longestStreak = 0;',
  '',
  '  for (const num of numSet) {',
  '    if (!numSet.has(num - 1)) {',
  '      let currentNum = num;',
  '      let currentStreak = 1;',
  '',
  '      while (numSet.has(currentNum + 1)) {',
  '        currentNum++;',
  '        currentStreak++;',
  '      }',
  '',
  '      longestStreak = Math.max(longestStreak, currentStreak);',
  '    }',
  '  }',
  '',
  '  return longestStreak;',
  '}'
];

module.exports = { meta, steps, code };
