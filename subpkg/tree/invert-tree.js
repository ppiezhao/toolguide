const meta = {
  id: 'invert-binary-tree',
  name: '翻转二叉树',
  nameEn: 'Invert Binary Tree',
  difficulty: 'easy',
  category: 'tree',
  tags: ['二叉树', '递归'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '翻转二叉树，将每个节点的左右子树互换。经典递归解法（或使用栈/队列迭代）。',
  defaultInput: {
    type: 'tree',
    value: {
      val: 4,
      left: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } },
      right: { val: 6, left: { val: 5, left: null, right: null }, right: { val: 7, left: null, right: null } }
    },
    label: '二叉搜索树 [4,2,6,1,3,5,7]'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const tree = deepClone(input);
  const swapped = [];
  const swappedEdges = [];
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { node: tree.val, action: '开始翻转' },
    description: `开始翻转二叉树，从根节点 ${tree.val} 开始`
  };

  // Use queue for level-order swap
  const queue = [tree];
  const beforeTree = deepClone(tree);

  while (queue.length > 0) {
    const node = queue.shift();
    stepNum++;

    // Record edges before swap
    const leftVal = node.left?.val ?? null;
    const rightVal = node.right?.val ?? null;

    yield {
      data: { type: 'tree', value: deepClone(beforeTree) },
      highlights: {
        codeLines: [2],
        nodeIds: [...swapped, node.val],
        edgeIds: [...swappedEdges]
      },
      variables: { step: stepNum, node: node.val, left: leftVal, right: rightVal },
      description: `第 ${stepNum} 步：节点 ${node.val} 交换左右子节点（左=${leftVal ?? 'null'}，右=${rightVal ?? 'null'}）`
    };

    // Swap
    [node.left, node.right] = [node.right, node.left];
    swapped.push(node.val);

    if (node.left) {
      queue.push(node.left);
      swappedEdges.push(`${node.val}->${node.left.val}`);
    }
    if (node.right) {
      queue.push(node.right);
      swappedEdges.push(`${node.val}->${node.right.val}`);
    }
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [3],
      nodeIds: [...swapped],
      edgeIds: [...swappedEdges]
    },
    variables: { swapped_count: swapped.length, result: '翻转完成' },
    description: `翻转完成！共交换 ${swapped.length} 个节点的左右子树`
  };
}

const code = [
  'function invertTree(root) {',
  '  if (root === null) return null;',
  '  [root.left, root.right] = [root.right, root.left];',
  '  invertTree(root.left);',
  '  invertTree(root.right);',
  '  return root;',
  '}'
];

module.exports = { meta, steps, code };
