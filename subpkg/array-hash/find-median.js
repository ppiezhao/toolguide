const meta = {
  id: 'find-median',
  name: '数据流中位数',
  nameEn: 'Find Median from Data Stream',
  difficulty: 'hard',
  category: 'array-hash',
  tags: ['堆', '中位数', '优先队列', '设计'],
  timeComplexity: 'O(log n) add, O(1) find',
  spaceComplexity: 'O(n)',
  description: '数据流中位数问题：设计一个数据结构支持两个操作：addNum 向数据结构中添加一个整数，findMedian 返回当前所有元素的中位数。使用两个堆（最大堆和最小堆）来维护数据流的中位数，保证最大堆的所有元素 <= 最小堆的所有元素，且两个堆的大小差不超过1。',
  defaultInput: {
    type: 'array',
    value: [1, 2, 3, 4, 5],
    label: '数据流: [1,2,3,4,5]'
  }
};

class SimpleHeap {
  constructor(comparator) {
    this.arr = [];
    this.comparator = comparator;
  }
  push(val) {
    this.arr.push(val);
    this.arr.sort(this.comparator);
  }
  pop() {
    return this.arr.shift();
  }
  peek() {
    return this.arr[0];
  }
  get size() {
    return this.arr.length;
  }
}

function* steps(input) {
  const stream = [1, 2, 3, 4, 5];
  const maxHeap = new SimpleHeap((a, b) => b - a); // 较小的一半
  const minHeap = new SimpleHeap((a, b) => a - b); // 较大的一半

  let median = null;

  yield {
    data: { type: 'array', value: [...stream] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { maxHeap: [], minHeap: [], median: null, phase: 'init' },
    description: '数据流中位数：最大堆存储较小的一半，最小堆存储较大的一半。'
  };

  for (let i = 0; i < stream.length; i++) {
    const num = stream[i];

    // 插入
    if (maxHeap.size === 0 || num <= maxHeap.peek()) {
      maxHeap.push(num);

      yield {
        data: { type: 'array', value: stream.slice(0, i + 1) },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          stream: stream.slice(0, i + 1),
          maxHeap: [...maxHeap.arr],
          minHeap: [...minHeap.arr],
          inserting: num,
          heap: 'maxHeap',
          phase: 'push'
        },
        description: `插入 ${num} 到最大堆（小半部分）。最大堆: [${maxHeap.arr.join(', ')}]，最小堆: [${minHeap.arr.join(', ')}]`
      };
    } else {
      minHeap.push(num);

      yield {
        data: { type: 'array', value: stream.slice(0, i + 1) },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          stream: stream.slice(0, i + 1),
          maxHeap: [...maxHeap.arr],
          minHeap: [...minHeap.arr],
          inserting: num,
          heap: 'minHeap',
          phase: 'push'
        },
        description: `插入 ${num} 到最小堆（大半部分）。最大堆: [${maxHeap.arr.join(', ')}]，最小堆: [${minHeap.arr.join(', ')}]`
      };
    }

    // 平衡两个堆
    if (maxHeap.size > minHeap.size + 1) {
      const moved = maxHeap.pop();
      minHeap.push(moved);

      yield {
        data: { type: 'array', value: stream.slice(0, i + 1) },
        highlights: { dataIndices: [], sortedIndices: [] },
        variables: {
          stream: stream.slice(0, i + 1),
          maxHeap: [...maxHeap.arr],
          minHeap: [...minHeap.arr],
          moved,
          phase: 'balance'
        },
        description: `平衡：将 ${moved} 从最大堆移到最小堆。最大堆: [${maxHeap.arr.join(', ')}]，最小堆: [${minHeap.arr.join(', ')}]`
      };
    } else if (minHeap.size > maxHeap.size) {
      const moved = minHeap.pop();
      maxHeap.push(moved);

      yield {
        data: { type: 'array', value: stream.slice(0, i + 1) },
        highlights: { dataIndices: [], sortedIndices: [] },
        variables: {
          stream: stream.slice(0, i + 1),
          maxHeap: [...maxHeap.arr],
          minHeap: [...minHeap.arr],
          moved,
          phase: 'balance'
        },
        description: `平衡：将 ${moved} 从最小堆移到最大堆。最大堆: [${maxHeap.arr.join(', ')}]，最小堆: [${minHeap.arr.join(', ')}]`
      };
    }

    // 计算中位数
    if (maxHeap.size > minHeap.size) {
      median = maxHeap.peek();
    } else {
      median = (maxHeap.peek() + minHeap.peek()) / 2;
    }

    yield {
      data: { type: 'array', value: stream.slice(0, i + 1) },
      highlights: { dataIndices: [i], sortedIndices: Array.from({ length: i + 1 }, (_, j) => j) },
      variables: {
        stream: stream.slice(0, i + 1),
        maxHeap: [...maxHeap.arr],
        minHeap: [...minHeap.arr],
        median,
        phase: 'median'
      },
      description: `当前数据流 [${stream.slice(0, i + 1).join(', ')}]，中位数=${median}`
    };
  }

  yield {
    data: { type: 'array', value: [...stream] },
    highlights: { dataIndices: [], sortedIndices: Array.from({ length: stream.length }, (_, i) => i) },
    variables: {
      stream: [...stream],
      maxHeap: [...maxHeap.arr],
      minHeap: [...minHeap.arr],
      median,
      complete: true
    },
    description: `处理完成！所有数据的中位数为 ${median}。`
  };
}

const code = [
  'class MedianFinder {',
  '  constructor() {',
  '    this.maxHeap = [];',
  '    this.minHeap = [];',
  '  }',
  '',
  '  addNum(num) {',
  '    if (this.maxHeap.length === 0 || num <= -this.maxHeap[0]) {',
  '      this.maxHeap.push(-num);',
  '    } else {',
  '      this.minHeap.push(num);',
  '    }',
  '    this.balance();',
  '  }',
  '',
  '  balance() {',
  '    if (this.maxHeap.length > this.minHeap.length + 1)',
  '      this.minHeap.push(-this.maxHeap.shift());',
  '    else if (this.minHeap.length > this.maxHeap.length)',
  '      this.maxHeap.push(-this.minHeap.shift());',
  '  }',
  '',
  '  findMedian() {',
  '    if (this.maxHeap.length > this.minHeap.length)',
  '      return -this.maxHeap[0];',
  '    return (-this.maxHeap[0] + this.minHeap[0]) / 2;',
  '  }',
  '}'
];

module.exports = { meta, steps, code };
