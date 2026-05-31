/**
 * 算法分类定义
 *
 * 每个分类对应一个 subpkg，包含 id、名称、图标和难度统计。
 */

const categories = [
  {
    id: 'all',
    name: '全部',
    icon: '📚',
    subpkg: null
  },
  {
    id: 'sorting',
    name: '排序',
    icon: '📊',
    subpkg: 'subpkg/sorting'
  },
  {
    id: 'searching',
    name: '搜索',
    icon: '🔍',
    subpkg: 'subpkg/searching'
  },
  {
    id: 'linkedlist',
    name: '链表',
    icon: '🔗',
    subpkg: 'subpkg/linkedlist'
  },
  {
    id: 'tree',
    name: '树',
    icon: '🌳',
    subpkg: 'subpkg/tree'
  },
  {
    id: 'graph',
    name: '图',
    icon: '🕸',
    subpkg: 'subpkg/graph'
  },
  {
    id: 'dp',
    name: '动态规划',
    icon: '🧩',
    subpkg: 'subpkg/dp'
  },
  {
    id: 'array-hash',
    name: '数组哈希',
    icon: '📋',
    subpkg: 'subpkg/array-hash'
  }
];

module.exports = categories;
