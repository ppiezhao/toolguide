const meta = {
  id: 'binary-tree-inorder',
  name: '中序遍历',
  nameEn: 'Binary Tree Inorder Traversal',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', '遍历', '栈'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '使用栈进行二叉树的中序遍历（左->根->右）。先遍历左子树，再访问根，最后遍历右子树。',
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
  const stack = [];
  let curr = tree;
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [],
      edgeIds: []
    },
    variables: { stack: [], curr: curr.val, visited: [] },
    description: '初始化空栈，curr 指向根节点'
  };

  while (curr !== null || stack.length > 0) {
    // Traverse to leftmost
    while (curr !== null) {
      stack.push(curr);
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [3, 4],
          nodeIds: [...visited],
          edgeIds: [...visitedEdges]
        },
        variables: { stack: stack.map(n => n.val), curr: curr.val, visited: [...visited] },
        description: `向左走到节点 ${curr.val}，将其入栈`
      };
      curr = curr.left;
    }

    if (curr === null && stack.length > 0) {
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [5],
          nodeIds: [...visited],
          edgeIds: [...visitedEdges]
        },
        variables: { stack: stack.map(n => n.val), curr: null, visited: [...visited] },
        description: '到达最左端（null），准备出栈'
      };
    }

    // Pop and visit
    curr = stack.pop();
    visited.push(curr.val);
    stepNum++;

    if (visited.length > 1) {
      visitedEdges.push(`${visited[visited.length - 2]}->${curr.val}`);
    }

    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [6, 7],
        nodeIds: [...visited],
        edgeIds: [...visitedEdges]
      },
      variables: { stack: stack.map(n => n.val), visited: [...visited], current: curr.val, step: stepNum },
      description: `第 ${stepNum} 步：出栈访问节点 ${curr.val}（左->根->右）`
    };

    // Move to right
    curr = curr.right;
    if (curr !== null) {
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [8],
          nodeIds: [...visited],
          edgeIds: [...visitedEdges]
        },
        variables: { stack: stack.map(n => n.val), curr: curr.val, visited: [...visited] },
        description: `转向右子节点 ${curr.val}`
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
    description: `中序遍历完成！遍历顺序：${visited.join(' -> ')}`
  };
}

const code = [
  'const stack = [];',
  'let curr = root, result = [];',
  'while (curr !== null || stack.length > 0) {',
  '  while (curr !== null) { stack.push(curr); curr = curr.left; }',
  '  curr = stack.pop();',
  '  result.push(curr.val);',
  '  curr = curr.right;',
  '}',
  'return result;'
];

module.exports = { meta, steps, code };
