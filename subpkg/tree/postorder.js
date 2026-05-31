const meta = {
  id: 'binary-tree-postorder',
  name: '后序遍历',
  nameEn: 'Binary Tree Postorder Traversal',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', '遍历', '栈'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '使用双栈法进行二叉树的后序遍历（左->右->根）。一个栈用于遍历，另一个栈用于收集结果再翻转。',
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
  const stack = [tree];
  const output = [];
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [],
      edgeIds: []
    },
    variables: { stack: [tree.val], output: [] },
    description: '初始化栈，将根节点推入栈'
  };

  while (stack.length > 0) {
    const node = stack.pop();
    output.push(node.val);

    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [3, 4],
        nodeIds: [...output],
        edgeIds: [...visitedEdges]
      },
      variables: { stack: stack.map(n => n.val), output: [...output], current: node.val },
      description: `第 ${++stepNum} 步：将节点 ${node.val} 加入输出栈`
    };

    // Push left then right (opposite of preorder because we'll reverse)
    if (node.left !== null) {
      stack.push(node.left);
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [5, 6],
          nodeIds: [...output],
          edgeIds: [...visitedEdges]
        },
        variables: { stack: stack.map(n => n.val), output: [...output] },
        description: `将左子节点 ${node.left.val} 入栈`
      };
    }

    if (node.right !== null) {
      stack.push(node.right);
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [7, 8],
          nodeIds: [...output],
          edgeIds: [...visitedEdges]
        },
        variables: { stack: stack.map(n => n.val), output: [...output] },
        description: `将右子节点 ${node.right.val} 入栈`
      };
    }
  }

  // Reverse output to get postorder
  const postorder = [...output].reverse();
  for (let i = 0; i < postorder.length - 1; i++) {
    visitedEdges.push(`${postorder[i]}->${postorder[i + 1]}`);
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [9],
      nodeIds: [...postorder],
      edgeIds: [...visitedEdges]
    },
    variables: { output: [...output], postorder: [...postorder], result: postorder.join(' -> ') },
    description: `后序遍历完成！遍历顺序：${postorder.join(' -> ')}（左->右->根）`
  };
}

const code = [
  'const stack = [root], output = [];',
  'while (stack.length > 0) {',
  '  const node = stack.pop();',
  '  output.push(node.val);',
  '  if (node.left !== null) stack.push(node.left);',
  '  if (node.right !== null) stack.push(node.right);',
  '}',
  'return output.reverse();'
];

module.exports = { meta, steps, code };
