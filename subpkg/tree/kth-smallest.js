const meta = {
  id: 'kth-smallest-element-in-bst',
  name: 'BST第K小',
  nameEn: 'Kth Smallest Element in BST',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', 'BST', '中序遍历'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '在二叉搜索树中查找第 k 小的元素。利用BST中序遍历是递增序列的特性，进行中序遍历计数。',
  defaultInput: {
    type: 'tree',
    value: {
      val: 4,
      left: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } },
      right: { val: 6, left: { val: 5, left: null, right: null }, right: { val: 7, left: null, right: null } }
    },
    label: 'BST第3小元素'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const tree = deepClone(input);
  const k = 3;
  let count = 0;
  let result = null;
  const visited = [];
  const visitedEdges = [];
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [],
      edgeIds: []
    },
    variables: { k, count: 0, found: '未找到' },
    description: `查找BST中第 ${k} 小的元素。利用中序遍历的递增特性。`
  };

  // Inorder traversal
  const stack = [];
  let curr = tree;

  while ((curr !== null || stack.length > 0) && result === null) {
    while (curr !== null) {
      stack.push(curr);
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [3, 4],
          nodeIds: [...visited],
          edgeIds: [...visitedEdges]
        },
        variables: { stack: stack.map(n => n.val), curr: curr.val, count },
        description: `向左走到节点 ${curr.val}，入栈`
      };
      curr = curr.left;
    }

    curr = stack.pop();
    count++;
    visited.push(curr.val);
    stepNum++;

    if (visited.length > 1) {
      visitedEdges.push(`${visited[visited.length - 2]}->${curr.val}`);
    }

    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [5, 6],
        nodeIds: [...visited],
        edgeIds: [...visitedEdges]
      },
      variables: { popped: curr.val, count, k, is_kth: count === k ? '是' : '否' },
      description: `中序第 ${count} 个访问节点：${curr.val}${count === k ? '，这就是第' + k + '小的元素！' : ''}`
    };

    if (count === k) {
      result = curr.val;
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [7],
          nodeIds: [...visited],
          edgeIds: [...visitedEdges]
        },
        variables: { k, count, result },
        description: `找到第 ${k} 小的元素：${result}`
      };
      break;
    }

    curr = curr.right;
    if (curr !== null) {
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [8],
          nodeIds: [...visited],
          edgeIds: [...visitedEdges]
        },
        variables: { curr: curr.val, count, k },
        description: `转向右子节点 ${curr.val}`
      };
    }
  }
}

const code = [
  'function kthSmallest(root, k) {',
  '  const stack = [];',
  '  let curr = root, count = 0;',
  '  while (curr !== null || stack.length > 0) {',
  '    while (curr !== null) { stack.push(curr); curr = curr.left; }',
  '    curr = stack.pop();',
  '    if (++count === k) return curr.val;',
  '    curr = curr.right;',
  '  }',
  '  return -1;',
  '}'
];

module.exports = { meta, steps, code };
