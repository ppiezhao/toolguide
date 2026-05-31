const meta = {
  id: 'container-water',
  name: '盛最多水的容器',
  nameEn: 'Container With Most Water',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['数组', '双指针', '贪心'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '盛最多水的容器问题：给定一个长度为 n 的整数数组 height，每个元素代表一条垂线的高度。找出两条线，使其与 x 轴共同构成的容器可以容纳最多的水。使用双指针从两端向中间移动，每次移动较矮的指针。',
  defaultInput: {
    type: 'array',
    value: [1, 8, 6, 2, 5, 4, 8, 3, 7],
    label: '高度数组: [1,8,6,2,5,4,8,3,7]'
  }
};

function* steps(input) {
  const height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;
  let maxLeft = 0, maxRight = 0;

  yield {
    data: { type: 'array', value: [...height] },
    highlights: { dataIndices: [left, right], sortedIndices: [] },
    variables: { height: [...height], left, right, maxArea, phase: 'init' },
    description: `高度数组: [${height.join(', ')}]。左指针=0（高度${height[0]}），右指针=${right}（高度${height[right]}）。`
  };

  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    const area = width * h;

    yield {
      data: { type: 'array', value: [...height] },
      highlights: { dataIndices: [left, right], sortedIndices: [] },
      variables: {
        height: [...height],
        left, right,
        leftHeight: height[left],
        rightHeight: height[right],
        width,
        minHeight: h,
        area,
        maxArea,
        phase: 'compare'
      },
      description: `左=${left}(高=${height[left]})，右=${right}(高=${height[right]})，宽=${width}，高=${h}，面积=${area}${area > maxArea ? '，新最大面积！' : ''}`
    };

    if (area > maxArea) {
      maxArea = area;
      maxLeft = left;
      maxRight = right;
    }

    if (height[left] < height[right]) {
      left++;

      yield {
        data: { type: 'array', value: [...height] },
        highlights: { dataIndices: [left, right], sortedIndices: [] },
        variables: {
          height: [...height],
          left, right,
          maxArea,
          phase: 'move_left'
        },
        description: `左指针较矮，左指针右移到 ${left}（高度=${height[left]}）。`
      };
    } else {
      right--;

      yield {
        data: { type: 'array', value: [...height] },
        highlights: { dataIndices: [left, right], sortedIndices: [] },
        variables: {
          height: [...height],
          left, right,
          maxArea,
          phase: 'move_right'
        },
        description: `右指针较矮或相等，右指针左移到 ${right}（高度=${height[right]}）。`
      };
    }
  }

  yield {
    data: { type: 'array', value: [...height] },
    highlights: { dataIndices: [maxLeft, maxRight], sortedIndices: Array.from({ length: height.length }, (_, i) => i) },
    variables: {
      height: [...height],
      left, right,
      maxArea,
      maxLeft,
      maxRight,
      complete: true
    },
    description: `计算完成！最大面积=${maxArea}，由索引${maxLeft}(高=${height[maxLeft]})和索引${maxRight}(高=${height[maxRight]})组成。`
  };
}

const code = [
  'function maxArea(height) {',
  '  let left = 0, right = height.length - 1;',
  '  let maxArea = 0;',
  '',
  '  while (left < right) {',
  '    const area = Math.min(height[left], height[right]) * (right - left);',
  '    maxArea = Math.max(maxArea, area);',
  '    if (height[left] < height[right]) left++;',
  '    else right--;',
  '  }',
  '',
  '  return maxArea;',
  '}'
];

module.exports = { meta, steps, code };
