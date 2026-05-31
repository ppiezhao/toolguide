const meta = {
  id: 'binary-tree-zigzag',
  name: '锯齿形遍历',
  nameEn: 'Binary Tree Zigzag Level Order Traversal',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', 'BFS', '层序遍历'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '二叉树的锯齿形层序遍历：第一层从左到右，第二层从右到左，以此类推。使用队列 + 方向标志。',
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
  const queue = [tree];
  let leftToRight = true;
  let level = 0;
  const allLevels = [];
  const visited = [];
  const visitedEdges = [];
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { level: 0, direction: '左->右', queue: [tree.val] },
    description: '初始化队列，第0层从左到右遍历'
  };

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      visited.push(node.val);
      stepNum++;

      if (visited.length > 1) {
        visitedEdges.push(`${visited[visited.length - 2]}->${node.val}`);
      }

      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }

    const levelValues = leftToRight ? [...currentLevel] : [...currentLevel].reverse();
    allLevels.push(levelValues);

    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [3, 4, 5],
        nodeIds: [...visited],
        edgeIds: [...visitedEdges]
      },
      variables: {
        level,
        direction: leftToRight ? '左->右' : '右->左',
        level_nodes: currentLevel.join(', '),
        level_result: levelValues.join(', ')
      },
      description: `第 ${level} 层（${leftToRight ? '左->右' : '右->左'}）：[${levelValues.join(', ')}]`
    };

    leftToRight = !leftToRight;
    level++;
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [6],
      nodeIds: [...visited],
      edgeIds: [...visitedEdges]
    },
    variables: {
      zigzag: allLevels.map((l, i) => `第${i}层:[${l.join(',')}]`).join(' '),
      levels: allLevels.length
    },
    description: `锯齿形遍历完成！${allLevels.map((l, i) => `第${i}层:${l.join(',')}`).join(' | ')}`
  };
}

const code = [
  'const queue = [root], result = [];',
  'let leftToRight = true;',
  'while (queue.length > 0) {',
  '  const level = queue.splice(0).map(n => n.val);',
  '  result.push(leftToRight ? level : level.reverse());',
  '  for (const node of queue.slice()) {',
  '    if (node.left) queue.push(node.left);',
  '    if (node.right) queue.push(node.right);',
  '  }',
  '  leftToRight = !leftToRight;',
  '}',
  'return result;'
];

module.exports = { meta, steps, code };
