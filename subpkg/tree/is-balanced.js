const meta = {
  id: 'balanced-binary-tree',
  name: '判断平衡二叉树',
  nameEn: 'Balanced Binary Tree',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', 'DFS', '递归'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '判断一棵二叉树是否是高度平衡的。平衡二叉树定义为每个节点的左右子树高度差不超过1。',
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
  const visited = [];
  const heights = new Map();
  const balanced = new Map();
  let overallBalanced = true;
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { node: tree.val, checking: '根节点' },
    description: '从根节点开始检查平衡性'
  };

  // Post-order traversal with stack
  const stack = [{ node: tree, state: 'enter' }];

  while (stack.length > 0) {
    const frame = stack.pop();
    const { node, state } = frame;

    if (state === 'enter') {
      visited.push(node.val);
      stepNum++;

      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [2],
          nodeIds: [...visited],
          edgeIds: []
        },
        variables: { step: stepNum, node: node.val },
        description: `第 ${stepNum} 步：访问节点 ${node.val}`
      };

      stack.push({ node, state: 'exit' });

      if (node.right !== null) {
        stack.push({ node: node.right, state: 'enter' });
      }
      if (node.left !== null) {
        stack.push({ node: node.left, state: 'enter' });
      }
    } else {
      const leftHeight = node.left !== null ? heights.get(node.left.val) || 0 : 0;
      const rightHeight = node.right !== null ? heights.get(node.right.val) || 0 : 0;
      const height = 1 + Math.max(leftHeight, rightHeight);
      const diff = Math.abs(leftHeight - rightHeight);
      const isNodeBalanced = diff <= 1;

      heights.set(node.val, height);
      balanced.set(node.val, isNodeBalanced);

      if (!isNodeBalanced) overallBalanced = false;

      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [3, 4, 5, 6],
          nodeIds: [...visited],
          edgeIds: []
        },
        variables: {
          node: node.val,
          left_height: leftHeight,
          right_height: rightHeight,
          height_diff: diff,
          is_balanced: isNodeBalanced ? '是' : '否'
        },
        description: `节点 ${node.val}：左高=${leftHeight}，右高=${rightHeight}，差=${diff}，${isNodeBalanced ? '平衡' : '不平衡'}`
      };
    }
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [7],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { is_balanced: overallBalanced ? '是' : '否', max_diff: '<=1' },
    description: overallBalanced ? '该二叉树是平衡二叉树！' : '该二叉树不是平衡二叉树！'
  };
}

const code = [
  'function isBalanced(root) {',
  '  function check(node) {',
  '    if (node === null) return 0;',
  '    const left = check(node.left);',
  '    const right = check(node.right);',
  '    if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1;',
  '    return 1 + Math.max(left, right);',
  '  }',
  '  return check(root) !== -1;',
  '}'
];

module.exports = { meta, steps, code };
