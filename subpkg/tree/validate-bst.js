const meta = {
  id: 'validate-binary-search-tree',
  name: '验证BST',
  nameEn: 'Validate Binary Search Tree',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', 'BST', '验证'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '判断一棵二叉树是否为有效的二叉搜索树（BST）。利用中序遍历递增性质或递归的 min/max 边界法。',
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
  const visitedEdges = [];
  let isValid = true;
  let prevVal = -Infinity;
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { node: tree.val, min: '-Infinity', max: 'Infinity', valid: true },
    description: '验证BST：每个节点的值必须在 (min, max) 范围内。从根节点开始。'
  };

  // Inorder traversal to check
  const stack = [];
  let curr = tree;

  while (curr !== null || stack.length > 0) {
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }

    curr = stack.pop();
    visited.push(curr.val);
    stepNum++;

    if (visited.length > 1) {
      visitedEdges.push(`${visited[visited.length - 2]}->${curr.val}`);
    }

    // Check if inorder is ascending
    if (curr.val <= prevVal) {
      isValid = false;
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [2, 3],
          nodeIds: [...visited],
          edgeIds: [...visitedEdges]
        },
        variables: { current: curr.val, prev: prevVal, valid: false, reason: `${curr.val} <= ${prevVal}` },
        description: `中序遍历检查：${curr.val} <= ${prevVal}，BST性质被破坏！不是有效的BST`
      };
      break;
    }

    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [2],
        nodeIds: [...visited],
        edgeIds: [...visitedEdges]
      },
      variables: { current: curr.val, prev: prevVal, valid: true, inorder: visited.join(' -> ') },
      description: `中序遍历节点 ${curr.val}，递增序列=[${visited.join(', ')}]，当前有效`
    };

    prevVal = curr.val;
    curr = curr.right;
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [4],
      nodeIds: [...visited],
      edgeIds: [...visitedEdges]
    },
    variables: { is_valid: isValid ? '是' : '否', inorder_sequence: visited.join(' -> ') },
    description: isValid ? '该二叉树是有效的BST！' : '该二叉树不是有效的BST！'
  };
}

const code = [
  'function isValidBST(root, min = -Infinity, max = Infinity) {',
  '  if (root === null) return true;',
  '  if (root.val <= min || root.val >= max) return false;',
  '  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);',
  '}'
];

module.exports = { meta, steps, code };
