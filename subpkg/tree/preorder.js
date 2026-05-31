const meta = {
  id: 'binary-tree-preorder',
  name: '前序遍历',
  nameEn: 'Binary Tree Preorder Traversal',
  difficulty: 'easy',
  category: 'tree',
  tags: ['二叉树', '遍历', '栈'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '使用栈进行二叉树的前序遍历（根->左->右）。迭代模拟递归过程。',
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
  const stack = [tree];
  const visitedEdges = [];
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { stack: [tree.val], visited: [] },
    description: `初始化栈，将根节点 ${tree.val} 入栈`
  };

  while (stack.length > 0) {
    const node = stack.pop();
    visited.push(node.val);
    stepNum++;

    const edgeId = stepNum > 1 ? `${visited[visited.length - 2]}->${node.val}` : null;
    if (edgeId) visitedEdges.push(edgeId);

    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [3, 4],
        nodeIds: [...visited],
        edgeIds: [...visitedEdges]
      },
      variables: { stack: stack.map(n => n.val), visited: [...visited], current: node.val },
      description: `第 ${stepNum} 步：访问节点 ${node.val}（根->左->右）`
    };

    // Push right first so left is processed first (LIFO)
    if (node.right !== null) {
      stack.push(node.right);
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [5, 6],
          nodeIds: [...visited],
          edgeIds: [...visitedEdges]
        },
        variables: { stack: stack.map(n => n.val), visited: [...visited], pushed: `右子节点 ${node.right.val}` },
        description: `将右子节点 ${node.right.val} 入栈（后进先出，右子节点先入栈）`
      };
    }

    if (node.left !== null) {
      stack.push(node.left);
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [7, 8],
          nodeIds: [...visited],
          edgeIds: [...visitedEdges]
        },
        variables: { stack: stack.map(n => n.val), visited: [...visited], pushed: `左子节点 ${node.left.val}` },
        description: `将左子节点 ${node.left.val} 入栈`
      };
    }
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [9],
      nodeIds: [...visited],
      edgeIds: [...visitedEdges]
    },
    variables: { stack: [], visited: [...visited], result: visited.join(' -> ') },
    description: `前序遍历完成！遍历顺序：${visited.join(' -> ')}`
  };
}

const code = [
  'const stack = [root];',
  'const result = [];',
  'while (stack.length > 0) {',
  '  const node = stack.pop();',
  '  result.push(node.val);',
  '  if (node.right) stack.push(node.right);',
  '  if (node.left) stack.push(node.left);',
  '}',
  'return result;'
];

module.exports = { meta, steps, code };
