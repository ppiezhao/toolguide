const meta = {
  id: 'lru-cache',
  name: 'LRU缓存',
  nameEn: 'LRU Cache',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['LRU', '缓存', '哈希表', '双向链表'],
  timeComplexity: 'O(1) get/put',
  spaceComplexity: 'O(capacity)',
  description: 'LRU（最近最少使用）缓存是一种常见的缓存淘汰策略。当缓存容量满时，淘汰最久未使用的数据。使用哈希表 + 双向链表可以在 O(1) 时间内完成 get 和 put 操作。每次访问数据时，将其移到链表头部。',
  defaultInput: {
    type: 'array',
    value: [2],
    label: 'LRU缓存容量: 2。操作: put(1,1), put(2,2), get(1), put(3,3), get(2), get(3)'
  }
};

function* steps(input) {
  const capacity = 2;
  const cache = {};
  const order = [];
  let result = null;

  yield {
    data: { type: 'array', value: order.map(k => `${k}:${cache[k]}`) },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { cache: { ...cache }, order: [...order], capacity, phase: 'init' },
    description: `初始化LRU缓存，容量=${capacity}。get/set操作演示。`
  };

  // put(1,1)
  const putOps = [
    { op: 'put', key: 1, value: 1 },
    { op: 'put', key: 2, value: 2 },
    { op: 'get', key: 1 },
    { op: 'put', key: 3, value: 3 },
    { op: 'get', key: 2 },
    { op: 'get', key: 3 }
  ];

  for (const op of putOps) {
    if (op.op === 'put') {
      const { key, value } = op;

      if (key in cache) {
        // 更新已有值
        cache[key] = value;
        const idx = order.indexOf(key);
        order.splice(idx, 1);
        order.push(key);

        yield {
          data: { type: 'array', value: order.map(k => `${k}:${cache[k]}`) },
          highlights: { dataIndices: [], sortedIndices: [] },
          variables: {
            cache: { ...cache },
            order: [...order],
            capacity,
            operation: `put(${key}, ${value})`,
            action: 'update',
            evicted: null,
            phase: 'put'
          },
          description: `put(${key}, ${value})：更新已有键 ${key}，将其移到队尾。缓存: [${order.map(k => `${k}:${cache[k]}`).join(', ')}]`
        };
      } else {
        if (order.length >= capacity) {
          const evicted = order.shift();
          delete cache[evicted];

          cache[key] = value;
          order.push(key);

          yield {
            data: { type: 'array', value: order.map(k => `${k}:${cache[k]}`) },
            highlights: { dataIndices: [], sortedIndices: [] },
            variables: {
              cache: { ...cache },
              order: [...order],
              capacity,
              operation: `put(${key}, ${value})`,
              action: 'evict',
              evicted,
              phase: 'put'
            },
            description: `put(${key}, ${value})：缓存已满，淘汰最久未使用的键 ${evicted}。缓存: [${order.map(k => `${k}:${cache[k]}`).join(', ')}]`
          };
        } else {
          cache[key] = value;
          order.push(key);

          yield {
            data: { type: 'array', value: order.map(k => `${k}:${cache[k]}`) },
            highlights: { dataIndices: [], sortedIndices: [] },
            variables: {
              cache: { ...cache },
              order: [...order],
              capacity,
              operation: `put(${key}, ${value})`,
              action: 'add',
              evicted: null,
              phase: 'put'
            },
            description: `put(${key}, ${value})：添加新键值对。缓存: [${order.map(k => `${k}:${cache[k]}`).join(', ')}]`
          };
        }
      }
    } else if (op.op === 'get') {
      const { key } = op;

      if (key in cache) {
        const idx = order.indexOf(key);
        order.splice(idx, 1);
        order.push(key);
        result = cache[key];

        yield {
          data: { type: 'array', value: order.map(k => `${k}:${cache[k]}`) },
          highlights: { dataIndices: [], sortedIndices: [] },
          variables: {
            cache: { ...cache },
            order: [...order],
            capacity,
            operation: `get(${key})`,
            result,
            action: 'hit',
            phase: 'get'
          },
          description: `get(${key})：命中，返回值=${result}，将 ${key} 移到队尾。缓存: [${order.map(k => `${k}:${cache[k]}`).join(', ')}]`
        };
      } else {
        result = -1;

        yield {
          data: { type: 'array', value: order.map(k => `${k}:${cache[k]}`) },
          highlights: { dataIndices: [], sortedIndices: [] },
          variables: {
            cache: { ...cache },
            order: [...order],
            capacity,
            operation: `get(${key})`,
            result,
            action: 'miss',
            phase: 'get'
          },
          description: `get(${key})：未命中，返回 -1。`
        };
      }
    }
  }

  yield {
    data: { type: 'array', value: order.map(k => `${k}:${cache[k]}`) },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      cache: { ...cache },
      order: [...order],
      capacity,
      finalState: order.map(k => `${k}:${cache[k]}`),
      complete: true
    },
    description: `操作完成！最终缓存状态: [${order.map(k => `${k}:${cache[k]}`).join(', ')}]`
  };
}

const code = [
  'class LRUCache {',
  '  constructor(capacity) {',
  '    this.capacity = capacity;',
  '    this.cache = new Map();',
  '  }',
  '',
  '  get(key) {',
  '    if (!this.cache.has(key)) return -1;',
  '    const value = this.cache.get(key);',
  '    this.cache.delete(key);',
  '    this.cache.set(key, value);',
  '    return value;',
  '  }',
  '',
  '  put(key, value) {',
  '    if (this.cache.has(key)) {',
  '      this.cache.delete(key);',
  '    } else if (this.cache.size >= this.capacity) {',
  '      this.cache.delete(this.cache.keys().next().value);',
  '    }',
  '    this.cache.set(key, value);',
  '  }',
  '}'
];

module.exports = { meta, steps, code };
