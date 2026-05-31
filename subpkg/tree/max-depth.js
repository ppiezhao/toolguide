const meta = {
  id: 'maximum-depth-of-binary-tree',
  name: '最大深度',
  nameEn: 'Maximum Depth of Binary Tree',
  difficulty: 'easy',
  category: 'tree',
  tags: ['二叉树', 'DFS', '递归'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(log n)',
  description: '计算二叉树的最大深度（根节点到最远叶子节点的最长路径上的节点数）。使用递归分治法。',
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
  const depths = new Map();

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { node: tree.val, depth: '?' },
    description: `从根节点 ${tree.val} 开始计算深度`
  };

  // DFS post-order using stack
  const stack = [{ node: tree, depth: 1, state: 'enter' }];
  let maxDepth = 0;
  let stepNum = 0;

  while (stack.length > 0) {
    const frame = stack.pop();
    const { node, depth, state } = frame;

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
        variables: { node: node.val, current_depth: depth },
        description: `第 ${stepNum} 步：访问节点 ${node.val}，当前深度 = ${depth}`
      };

      stack.push({ node, depth, state: 'exit' });

      if (node.right !== null) {
        stack.push({ node: node.right, depth: depth + 1, state: 'enter' });
      }
      if (node.left !== null) {
        stack.push({ node: node.left, depth: depth + 1, state: 'enter' });
      }
    } else {
      // Post-order: calculate depth
      const leftDepth = node.left !== null ? (depths.get(node.left.val) || 0) : 0;
      const rightDepth = node.right !== null ? (depths.get(node.right.val) || 0) : 0;
      const nodeDepth = 1 + Math.max(leftDepth, rightDepth);
      depths.set(node.val, nodeDepth);
      maxDepth = Math.max(maxDepth, nodeDepth);

      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [3, 4, 5],
          nodeIds: [...visited],
          edgeIds: []
        },
        variables: { node: node.val, left_depth: leftDepth, right_depth: rightDepth, node_max_depth: nodeDepth },
        description: `节点 ${node.val}：左子树深度=${leftDepth}，右子树深度=${rightDepth}，自身深度=${nodeDepth}`
      };
    }
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [6],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { max_depth: maxDepth, info: `树的最大深度为 ${maxDepth}` },
    description: `二叉树的最大深度为 ${maxDepth}`
  };
}

const code = [
  'function maxDepth(root) {',
  '  if (root === null) return 0;',
  '  const left = maxDepth(root.left);',
  '  const right = maxDepth(root.right);',
  '  return 1 + Math.max(left, right);',
  '}'
];

module.exports = { meta, steps, code };
