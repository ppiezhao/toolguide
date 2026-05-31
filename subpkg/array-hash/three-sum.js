const meta = {
  id: 'three-sum',
  name: '三数之和',
  nameEn: 'Three Sum',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['数组', '双指针', '三数之和', '排序'],
  timeComplexity: 'O(n^2)',
  spaceComplexity: 'O(1)',
  description: '三数之和问题：给定一个整数数组，找出所有和为0且不重复的三元组。先对数组排序，然后固定一个数，用双指针在剩余区间中寻找两数之和等于目标值。注意去重。',
  defaultInput: {
    type: 'array',
    value: [-1, 0, 1, 2, -1, -4],
    label: '数组: [-1,0,1,2,-1,-4]'
  }
};

function* steps(input) {
  const nums = [-1, 0, 1, 2, -1, -4];
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { nums: [...nums], sorted: [...sorted], result: [], phase: 'sort' },
    description: `原数组: [${nums.join(', ')}]，排序后: [${sorted.join(', ')}]。固定一个数，双指针找另外两个数。`
  };

  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) {
      yield {
        data: { type: 'array', value: [...sorted] },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: { sorted: [...sorted], result, i, phase: 'skip_dup' },
        description: `跳过重复元素 sorted[${i}]=${sorted[i]}（与上一位相同）。`
      };
      continue;
    }

    let left = i + 1;
    let right = sorted.length - 1;

    yield {
      data: { type: 'array', value: [...sorted] },
      highlights: { dataIndices: [i, left, right], sortedIndices: [] },
      variables: { sorted: [...sorted], result, i, left, right, fixed: sorted[i], phase: 'fixed' },
      description: `固定 sorted[${i}]=${sorted[i]}，在 [${left}, ${right}] 区间中寻找两数之和为 ${-sorted[i]}。`
    };

    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];

      yield {
        data: { type: 'array', value: [...sorted] },
        highlights: { dataIndices: [i, left, right], sortedIndices: [] },
        variables: {
          sorted: [...sorted], result, i, left, right,
          fixed: sorted[i], leftVal: sorted[left], rightVal: sorted[right],
          sum,
          phase: 'check'
        },
        description: `三数之和: ${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${sum}`
      };

      if (sum === 0) {
        result.push([sorted[i], sorted[left], sorted[right]]);

        yield {
          data: { type: 'array', value: [...sorted] },
          highlights: { dataIndices: [i, left, right], sortedIndices: [i, left, right] },
          variables: {
            sorted: [...sorted], result: result.map(r => `[${r.join(',')}]`),
            i, left, right,
            triplet: [sorted[i], sorted[left], sorted[right]],
            sum,
            phase: 'found'
          },
          description: `找到三元组 [${sorted[i]}, ${sorted[left]}, ${sorted[right]}]。已找到 ${result.length} 组。`
        };

        while (left < right && sorted[left] === sorted[left + 1]) left++;
        while (left < right && sorted[right] === sorted[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  yield {
    data: { type: 'array', value: [...sorted] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      sorted: [...sorted],
      result: result.map(r => `[${r.join(',')}]`),
      resultCount: result.length,
      complete: true
    },
    description: `计算完成！找到 ${result.length} 组和为0的三元组: ${result.map(r => `[${r.join(',')}]`).join(', ')}`
  };
}

const code = [
  'function threeSum(nums) {',
  '  nums.sort((a, b) => a - b);',
  '  const result = [];',
  '',
  '  for (let i = 0; i < nums.length - 2; i++) {',
  '    if (i > 0 && nums[i] === nums[i - 1]) continue;',
  '    let left = i + 1, right = nums.length - 1;',
  '',
  '    while (left < right) {',
  '      const sum = nums[i] + nums[left] + nums[right];',
  '      if (sum === 0) {',
  '        result.push([nums[i], nums[left], nums[right]]);',
  '        while (left < right && nums[left] === nums[left + 1]) left++;',
  '        while (left < right && nums[right] === nums[right - 1]) right--;',
  '        left++; right--;',
  '      } else if (sum < 0) left++;',
  '      else right--;',
  '    }',
  '  }',
  '',
  '  return result;',
  '}'
];

module.exports = { meta, steps, code };
