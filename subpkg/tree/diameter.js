const meta = {
  id: 'diameter-of-binary-tree',
  name: '二叉树直径',
  nameEn: 'Diameter of Binary Tree',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', 'DFS', '递归'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '二叉树的直径是任意两个节点路径长度中的最大值。使用后序遍历计算每个节点的左右子树深度和。',
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
  const heights = new Map();
  let diameter = 0;
  let stepNum = 0;
  const visited = [];

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { node: tree.val, diameter: 0 },
    description: '计算二叉树直径。对每个节点，计算左子树深度 + 右子树深度，取最大值。'
  };

  // Post-order stack
  const stack = [{ node: tree, state: 'enter' }];

  while (stack.length > 0) {
    const frame = stack.pop();
    const { node, state } = frame;

    if (state === 'enter') {
      visited.push(node.val);
      stack.push({ node, state: 'exit' });

      if (node.right !== null) {
        stack.push({ node: node.right, state: 'enter' });
      }
      if (node.left !== null) {
        stack.push({ node: node.left, state: 'enter' });
      }
    } else {
      stepNum++;
      const leftHeight = node.left !== null ? heights.get(node.left.val) || 0 : 0;
      const rightHeight = node.right !== null ? heights.get(node.right.val) || 0 : 0;
      const nodeHeight = 1 + Math.max(leftHeight, rightHeight);
      const pathThroughNode = leftHeight + rightHeight;
      diameter = Math.max(diameter, pathThroughNode);

      heights.set(node.val, nodeHeight);

      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [2, 3, 4],
          nodeIds: [...visited],
          edgeIds: []
        },
        variables: {
          step: stepNum,
          node: node.val,
          left_depth: leftHeight,
          right_depth: rightHeight,
          path_through: pathThroughNode,
          current_diameter: diameter,
          node_height: nodeHeight
        },
        description: `第 ${stepNum} 步：节点 ${node.val}，左深=${leftHeight}，右深=${rightHeight}，经过路径=${pathThroughNode}，当前直径=${diameter}`
      };
    }
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [5],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { diameter },
    description: `二叉树直径为 ${diameter}（最长路径经过的边数）`
  };
}

const code = [
  'function diameterOfBinaryTree(root) {',
  '  let diameter = 0;',
  '  function dfs(node) {',
  '    if (node === null) return 0;',
  '    const left = dfs(node.left);',
  '    const right = dfs(node.right);',
  '    diameter = Math.max(diameter, left + right);',
  '    return 1 + Math.max(left, right);',
  '  }',
  '  dfs(root);',
  '  return diameter;',
  '}'
];

module.exports = { meta, steps, code };
