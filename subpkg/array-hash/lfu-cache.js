const meta = {
  id: 'lfu-cache',
  name: 'LFU缓存',
  nameEn: 'LFU Cache',
  difficulty: 'hard',
  category: 'array-hash',
  tags: ['LFU', '缓存', '哈希表', '频率', '设计'],
  timeComplexity: 'O(1)',
  spaceComplexity: 'O(capacity)',
  description: 'LFU（最不经常使用）缓存淘汰策略：当缓存满时，淘汰使用频率最低的数据。如果多个数据有相同的最低频率，则淘汰最久未使用的（LRU）。使用哈希表存储键值对和频率信息。',
  defaultInput: {
    type: 'array',
    value: [2],
    label: 'LFU缓存容量: 2。操作: put(1,1), put(2,2), get(1), put(3,3), get(2), get(3)'
  }
};

function* steps(input) {
  const capacity = 2;
  const cache = {};
  const freq = {};
  let minFreq = 0;

  yield {
    data: { type: 'array', value: [] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { cache: { ...cache }, freq: { ...freq }, minFreq, capacity, phase: 'init' },
    description: `初始化LFU缓存，容量=${capacity}。使用哈希表存储值和频率，淘汰使用频率最低的键。`
  };

  const ops = [
    { type: 'put', key: 1, val: 1 },
    { type: 'put', key: 2, val: 2 },
    { type: 'get', key: 1 },
    { type: 'put', key: 3, val: 3 },
    { type: 'get', key: 2 },
    { type: 'get', key: 3 }
  ];

  for (const op of ops) {
    if (op.type === 'put') {
      const { key, val } = op;

      if (key in cache) {
        // 更新
        cache[key] = val;
        freq[key]++;
        minFreq = Math.min(minFreq, freq[key]);

        yield {
          data: { type: 'array', value: Object.entries(cache).map(([k, v]) => `${k}:${v}(f=${freq[k]})`) },
          highlights: { dataIndices: [], sortedIndices: [] },
          variables: {
            cache: { ...cache },
            freq: { ...freq },
            minFreq,
            capacity,
            operation: `put(${key}, ${val})`,
            action: 'update',
            evicted: null,
            phase: 'put'
          },
          description: `put(${key}, ${val})：更新键 ${key}，使用频率=${freq[key]}。`
        };
      } else {
        if (Object.keys(cache).length >= capacity) {
          // 淘汰频率最低且最久未使用的
          let evictKey = null;
          let evictFreq = Infinity;
          for (const k of Object.keys(cache)) {
            if (freq[k] < evictFreq) {
              evictFreq = freq[k];
              evictKey = k;
            }
          }

          delete cache[evictKey];
          delete freq[evictKey];

          cache[key] = val;
          freq[key] = 1;
          minFreq = 1;

          yield {
            data: { type: 'array', value: Object.entries(cache).map(([k, v]) => `${k}:${v}(f=${freq[k]})`) },
            highlights: { dataIndices: [], sortedIndices: [] },
            variables: {
              cache: { ...cache },
              freq: { ...freq },
              minFreq,
              capacity,
              operation: `put(${key}, ${val})`,
              action: 'evict',
              evicted: evictKey,
              evictedFreq: evictFreq,
              phase: 'put'
            },
            description: `put(${key}, ${val})：缓存满，淘汰频率最低的键 ${evictKey}(f=${evictFreq})，添加 ${key}(f=1)。`
          };
        } else {
          cache[key] = val;
          freq[key] = 1;
          minFreq = 1;

          yield {
            data: { type: 'array', value: Object.entries(cache).map(([k, v]) => `${k}:${v}(f=${freq[k]})`) },
            highlights: { dataIndices: [], sortedIndices: [] },
            variables: {
              cache: { ...cache },
              freq: { ...freq },
              minFreq,
              capacity,
              operation: `put(${key}, ${val})`,
              action: 'add',
              evicted: null,
              phase: 'put'
            },
            description: `put(${key}, ${val})：添加新键值对，使用频率=1。`
          };
        }
      }
    } else if (op.type === 'get') {
      const { key } = op;

      if (key in cache) {
        freq[key]++;
        const result = cache[key];

        yield {
          data: { type: 'array', value: Object.entries(cache).map(([k, v]) => `${k}:${v}(f=${freq[k]})`) },
          highlights: { dataIndices: [], sortedIndices: [] },
          variables: {
            cache: { ...cache },
            freq: { ...freq },
            minFreq,
            capacity,
            operation: `get(${key})`,
            result,
            action: 'hit',
            phase: 'get'
          },
          description: `get(${key})：命中，返回值=${cache[key]}，使用频率增为 ${freq[key]}。`
        };
      } else {
        yield {
          data: { type: 'array', value: Object.entries(cache).map(([k, v]) => `${k}:${v}(f=${freq[k]})`) },
          highlights: { dataIndices: [], sortedIndices: [] },
          variables: {
            cache: { ...cache },
            freq: { ...freq },
            minFreq,
            capacity,
            operation: `get(${key})`,
            result: -1,
            action: 'miss',
            phase: 'get'
          },
          description: `get(${key})：未命中，返回 -1。`
        };
      }
    }
  }

  yield {
    data: { type: 'array', value: Object.entries(cache).map(([k, v]) => `${k}:${v}(f=${freq[k]})`) },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      cache: { ...cache },
      freq: { ...freq },
      minFreq,
      capacity,
      complete: true
    },
    description: `操作完成！最终缓存: ${Object.entries(cache).map(([k, v]) => `${k}:${v}(f=${freq[k]})`).join(', ')}`
  };
}

const code = [
  'class LFUCache {',
  '  constructor(capacity) {',
  '    this.capacity = capacity;',
  '    this.cache = new Map();',
  '    this.freq = new Map();',
  '  }',
  '',
  '  get(key) {',
  '    if (!this.cache.has(key)) return -1;',
  '    this.freq.set(key, this.freq.get(key) + 1);',
  '    return this.cache.get(key);',
  '  }',
  '',
  '  put(key, value) {',
  '    if (this.capacity === 0) return;',
  '    if (this.cache.has(key)) {',
  '      this.cache.set(key, value);',
  '      this.freq.set(key, this.freq.get(key) + 1);',
  '      return;',
  '    }',
  '    if (this.cache.size >= this.capacity) {',
  '      let minFreq = Infinity, evictKey = null;',
  '      for (const [k] of this.cache) {',
  '        if (this.freq.get(k) < minFreq) {',
  '          minFreq = this.freq.get(k);',
  '          evictKey = k;',
  '        }',
  '      }',
  '      this.cache.delete(evictKey);',
  '      this.freq.delete(evictKey);',
  '    }',
  '    this.cache.set(key, value);',
  '    this.freq.set(key, 1);',
  '  }',
  '}'
];

module.exports = { meta, steps, code };
