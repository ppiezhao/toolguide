const meta = {
  id: 'largest-rectangle',
  name: '柱状图中最大矩形',
  nameEn: 'Largest Rectangle in Histogram',
  difficulty: 'hard',
  category: 'array-hash',
  tags: ['数组', '栈', '单调栈', '柱状图'],
  timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  description: '柱状图中最大矩形问题：给定 n 个非负整数，表示柱状图中每个柱子的高度，每个柱子宽度为 1，求柱状图中能勾勒出的最大矩形面积。使用单调递增栈：从左到右遍历，遇到高度下降时弹出栈顶并计算面积。',
  defaultInput: {
    type: 'array',
    value: [2, 1, 5, 6, 2, 3],
    label: '高度: [2,1,5,6,2,3]'
  }
};

function* steps(input) {
  const heights = [2, 1, 5, 6, 2, 3];
  let maxArea = 0;
  const stack = []; // 存储索引，保持高度递增

  yield {
    data: { type: 'array', value: [...heights] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      heights: [...heights],
      stack: [...stack],
      maxArea,
      phase: 'init'
    },
    description: `柱状图高度: [${heights.join(', ')}]。使用单调递增栈计算最大矩形面积。`
  };

  for (let i = 0; i <= heights.length; i++) {
    const h = i < heights.length ? heights[i] : 0;

    yield {
      data: { type: 'array', value: [...heights] },
      highlights: {
        dataIndices: i < heights.length ? [i] : [],
        sortedIndices: []
      },
      variables: {
        heights: [...heights],
        stack: [...stack],
        i,
        currentHeight: h,
        maxArea,
        phase: 'scan'
      },
      description: i < heights.length
        ? `处理柱子[${i}]，高度=${h}` + (stack.length > 0 ? `，栈顶高度=${heights[stack[stack.length - 1]]}` : '，栈为空')
        : `遍历结束，处理栈中剩余元素（虚拟高度 0）`
    };

    while (stack.length > 0 && heights[stack[stack.length - 1]] > h) {
      const topIndex = stack.pop();
      const topHeight = heights[topIndex];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      const area = topHeight * width;

      yield {
        data: { type: 'array', value: [...heights] },
        highlights: {
          dataIndices: [topIndex, ...stack],
          sortedIndices: area >= maxArea && maxArea > 0 ? [topIndex] : []
        },
        variables: {
          heights: [...heights],
          stack: [...stack],
          i,
          currentHeight: h,
          poppedIndex: topIndex,
          poppedHeight: topHeight,
          width,
          area,
          maxArea: Math.max(maxArea, area),
          phase: 'pop'
        },
        description: `弹出栈顶 高度=${topHeight} 索引=${topIndex}，宽度=${width}（${stack.length === 0 ? '左侧无边' : `左侧=${stack[stack.length - 1]}`}，右侧=${i}），面积=${topHeight}×${width}=${area}${area > maxArea ? ' ★ 新纪录' : ''}`
      };

      if (area > maxArea) {
        maxArea = area;

        yield {
          data: { type: 'array', value: [...heights] },
          highlights: {
            dataIndices: [topIndex],
            sortedIndices: [topIndex]
          },
          variables: {
            heights: [...heights],
            stack: [...stack],
            i,
            poppedIndex: topIndex,
            poppedHeight: topHeight,
            width,
            area,
            maxArea,
            phase: 'update'
          },
          description: `更新最大面积: ${maxArea}`
        };
      }
    }

    if (i < heights.length) {
      stack.push(i);

      yield {
        data: { type: 'array', value: [...heights] },
        highlights: {
          dataIndices: [i],
          sortedIndices: []
        },
        variables: {
          heights: [...heights],
          stack: [...stack],
          i,
          currentHeight: h,
          maxArea,
          phase: 'push'
        },
        description: `索引 ${i}（高度=${h}）入栈。栈: [${stack.map(idx => `(${idx},${heights[idx]})`).join(', ') || '空'}]`
      };
    }
  }

  yield {
    data: { type: 'array', value: [...heights] },
    highlights: {
      dataIndices: [],
      sortedIndices: [0, 1, 2, 3, 4, 5]
    },
    variables: {
      heights: [...heights],
      stack: [],
      maxArea,
      phase: 'done'
    },
    description: `完成！柱状图中最大矩形面积 = ${maxArea}`
  };
}

const code = [
  'function largestRectangleArea(heights) {',
  '  const stack = [];',
  '  let maxArea = 0;',
  '',
  '  for (let i = 0; i <= heights.length; i++) {',
  '    const h = (i < heights.length) ? heights[i] : 0;',
  '    while (stack.length > 0 &&',
  '           heights[stack[stack.length-1]] > h) {',
  '      const topH = heights[stack.pop()];',
  '      const w = stack.length === 0',
  '        ? i',
  '        : i - stack[stack.length-1] - 1;',
  '      maxArea = Math.max(maxArea, topH * w);',
  '    }',
  '    stack.push(i);',
  '  }',
  '',
  '  return maxArea;',
  '}'
];

module.exports = { meta, steps, code };
