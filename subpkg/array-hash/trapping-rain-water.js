const meta = {
  id: 'trapping-rain-water',
  name: '接雨水',
  nameEn: 'Trapping Rain Water',
  difficulty: 'hard',
  category: 'array-hash',
  tags: ['数组', '双指针', '栈', '单调栈'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '接雨水问题：给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。使用双指针法，从两端向中间遍历，维护左右最大高度。',
  defaultInput: {
    type: 'array',
    value: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
    label: '高度: [0,1,0,2,1,0,1,3,2,1,2,1]'
  }
};

function* steps(input) {
  const height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let totalWater = 0;

  yield {
    data: { type: 'array', value: [...height] },
    highlights: { dataIndices: [left, right], sortedIndices: [] },
    variables: { height: [...height], left, right, leftMax, rightMax, totalWater, phase: 'init' },
    description: `高度数组: [${height.join(', ')}]。双指针从两端向中间移动，计算每个位置能接的雨水量。`
  };

  while (left < right) {
    if (height[left] < height[right]) {
      // 左边更低
      if (height[left] >= leftMax) {
        leftMax = height[left];

        yield {
          data: { type: 'array', value: [...height] },
          highlights: { dataIndices: [left, right], sortedIndices: [] },
          variables: {
            height: [...height],
            left, right,
            leftMax, rightMax,
            totalWater,
            phase: 'left_max'
          },
          description: `左指针高度=${height[left]} >= leftMax=${leftMax === 0 ? 0 : leftMax}，更新leftMax=${height[left]}。`
        };
      } else {
        const water = leftMax - height[left];
        totalWater += water;

        yield {
          data: { type: 'array', value: [...height] },
          highlights: { dataIndices: [left], sortedIndices: [] },
          variables: {
            height: [...height],
            left, right,
            leftMax, rightMax,
            totalWater,
            water,
            phase: 'left_water'
          },
          description: `位置${left}：高=${height[left]}，leftMax=${leftMax}，接水${water}。总量=${totalWater}。`
        };
      }
      left++;
    } else {
      // 右边更低或相等
      if (height[right] >= rightMax) {
        rightMax = height[right];

        yield {
          data: { type: 'array', value: [...height] },
          highlights: { dataIndices: [left, right], sortedIndices: [] },
          variables: {
            height: [...height],
            left, right,
            leftMax, rightMax,
            totalWater,
            phase: 'right_max'
          },
          description: `右指针高度=${height[right]} >= rightMax=${rightMax === 0 ? 0 : rightMax}，更新rightMax=${height[right]}。`
        };
      } else {
        const water = rightMax - height[right];
        totalWater += water;

        yield {
          data: { type: 'array', value: [...height] },
          highlights: { dataIndices: [right], sortedIndices: [] },
          variables: {
            height: [...height],
            left, right,
            leftMax, rightMax,
            totalWater,
            water,
            phase: 'right_water'
          },
          description: `位置${right}：高=${height[right]}，rightMax=${rightMax}，接水${water}。总量=${totalWater}。`
        };
      }
      right--;
    }
  }

  yield {
    data: { type: 'array', value: [...height] },
    highlights: { dataIndices: [], sortedIndices: Array.from({ length: height.length }, (_, i) => i) },
    variables: {
      height: [...height],
      left, right,
      leftMax, rightMax,
      totalWater,
      complete: true
    },
    description: `计算完成！总共能接 ${totalWater} 单位雨水。`
  };
}

const code = [
  'function trap(height) {',
  '  let left = 0, right = height.length - 1;',
  '  let leftMax = 0, rightMax = 0, total = 0;',
  '',
  '  while (left < right) {',
  '    if (height[left] < height[right]) {',
  '      if (height[left] >= leftMax) leftMax = height[left];',
  '      else total += leftMax - height[left];',
  '      left++;',
  '    } else {',
  '      if (height[right] >= rightMax) rightMax = height[right];',
  '      else total += rightMax - height[right];',
  '      right--;',
  '    }',
  '  }',
  '',
  '  return total;',
  '}'
];

module.exports = { meta, steps, code };
