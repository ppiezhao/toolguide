const meta = {
  id: 'min-stack',
  name: '最小栈',
  nameEn: 'Min Stack',
  difficulty: 'easy',
  category: 'array-hash',
  tags: ['栈', '设计', '数据结构'],
  timeComplexity: 'O(1)',
  spaceComplexity: 'O(n)',
  description: '最小栈问题：设计一个支持 push、pop、top 和 getMin 操作的栈数据结构，且所有操作的时间复杂度为 O(1)。使用辅助栈来跟踪当前最小值，每次入栈时同时将当前最小值入辅助栈。',
  defaultInput: {
    type: 'array',
    value: ['push(-2)', 'push(0)', 'push(-3)', 'getMin()', 'pop()', 'top()', 'getMin()'],
    label: '操作序列: push(-2), push(0), push(-3), getMin, pop, top, getMin'
  }
};

function* steps(input) {
  const mainStack = [];
  const minStack = [];
  const ops = ['push(-2)', 'push(0)', 'push(-3)', 'getMin()', 'pop()', 'top()', 'getMin()'];

  yield {
    data: { type: 'array', value: ['操作步骤'] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { mainStack: [...mainStack], minStack: [...minStack], phase: 'init' },
    description: '初始化最小栈。主栈和辅助栈都为空。'
  };

  let result = null;

  for (const op of ops) {
    // ...这部分生成步骤
    if (op.startsWith('push')) {
      const val = parseInt(op.match(/-?\d+/)[0]);
      mainStack.push(val);
      if (minStack.length === 0 || val <= minStack[minStack.length - 1]) {
        minStack.push(val);
      } else {
        minStack.push(minStack[minStack.length - 1]);
      }

      yield {
        data: { type: 'array', value: [{ push: val }] },
        highlights: { dataIndices: [], sortedIndices: [] },
        variables: {
          operation: `push(${val})`,
          mainStack: [...mainStack],
          minStack: [...minStack],
          getMin: minStack[minStack.length - 1],
          result: null,
          phase: 'push'
        },
        description: `push(${val})：入栈 ${val}，当前最小值=${minStack[minStack.length - 1]}。`
      };
    } else if (op.startsWith('pop')) {
      const val = mainStack.pop();
      minStack.pop();

      yield {
        data: { type: 'array', value: [{ pop: val }] },
        highlights: { dataIndices: [], sortedIndices: [] },
        variables: {
          operation: 'pop()',
          mainStack: [...mainStack],
          minStack: [...minStack],
          popped: val,
          getMin: minStack.length > 0 ? minStack[minStack.length - 1] : null,
          result: null,
          phase: 'pop'
        },
        description: `pop()：弹出 ${val}，当前最小值=${minStack.length > 0 ? minStack[minStack.length - 1] : 'null'}。`
      };
    } else if (op.startsWith('top')) {
      result = mainStack[mainStack.length - 1];

      yield {
        data: { type: 'array', value: [{ top: result }] },
        highlights: { dataIndices: [], sortedIndices: [] },
        variables: {
          operation: 'top()',
          mainStack: [...mainStack],
          minStack: [...minStack],
          result,
          getMin: minStack[minStack.length - 1],
          phase: 'top'
        },
        description: `top()：栈顶元素为 ${result}，当前最小值=${minStack[minStack.length - 1]}。`
      };
    } else if (op.startsWith('getMin')) {
      result = minStack[minStack.length - 1];

      yield {
        data: { type: 'array', value: [{ getMin: result }] },
        highlights: { dataIndices: [], sortedIndices: [] },
        variables: {
          operation: 'getMin()',
          mainStack: [...mainStack],
          minStack: [...minStack],
          result,
          getMin: result,
          phase: 'getMin'
        },
        description: `getMin()：当前最小值为 ${result}。`
      };
    }
  }

  yield {
    data: { type: 'array', value: [] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      mainStack: [...mainStack],
      minStack: [...minStack],
      complete: true
    },
    description: '最小栈操作完成！最小栈可在 O(1) 时间返回最小值。'
  };
}

const code = [
  'class MinStack {',
  '  constructor() {',
  '    this.stack = [];',
  '    this.minStack = [];',
  '  }',
  '',
  '  push(val) {',
  '    this.stack.push(val);',
  '    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {',
  '      this.minStack.push(val);',
  '    } else {',
  '      this.minStack.push(this.minStack[this.minStack.length - 1]);',
  '    }',
  '  }',
  '',
  '  pop() {',
  '    this.minStack.pop();',
  '    return this.stack.pop();',
  '  }',
  '',
  '  top() {',
  '    return this.stack[this.stack.length - 1];',
  '  }',
  '',
  '  getMin() {',
  '    return this.minStack[this.minStack.length - 1];',
  '  }',
  '}'
];

module.exports = { meta, steps, code };
