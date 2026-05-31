const meta = {
  id: 'binary-tree-level-order',
  name: '层序遍历',
  nameEn: 'Binary Tree Level Order Traversal',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', 'BFS', '队列'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '使用队列进行二叉树的层序遍历（BFS），逐层从左到右访问每个节点。',
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
  const queue = [tree];
  const levels = [[tree.val]];
  let level = 0;
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { queue: [tree.val], level: 0, levels: [[tree.val]] },
    description: `初始化队列，将根节点 ${tree.val} 入队`
  };

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevelNodes = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      visited.push(node.val);
      currentLevelNodes.push(node.val);
      stepNum++;

      if (visited.length > 1) {
        visitedEdges.push(`${visited[visited.length - 2]}->${node.val}`);
      }

      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [3, 4],
          nodeIds: [...visited],
          edgeIds: [...visitedEdges]
        },
        variables: { queue: queue.map(n => n.val), visited: [...visited], current: node.val, level, step: stepNum },
        description: `第 ${stepNum} 步：访问第 ${level} 层的节点 ${node.val}`
      };

      if (node.left !== null) {
        queue.push(node.left);
        yield {
          data: { type: 'tree', value: deepClone(tree) },
          highlights: {
            codeLines: [5, 6],
            nodeIds: [...visited],
            edgeIds: [...visitedEdges]
          },
          variables: { queue: queue.map(n => n.val), visited: [...visited], enqueued: node.left.val },
          description: `将左子节点 ${node.left.val} 入队`
        };
      }

      if (node.right !== null) {
        queue.push(node.right);
        yield {
          data: { type: 'tree', value: deepClone(tree) },
          highlights: {
            codeLines: [7, 8],
            nodeIds: [...visited],
            edgeIds: [...visitedEdges]
          },
          variables: { queue: queue.map(n => n.val), visited: [...visited], enqueued: node.right.val },
          description: `将右子节点 ${node.right.val} 入队`
        };
      }
    }

    if (currentLevelNodes.length > 0) {
      levels.push(currentLevelNodes);
    }
    level++;
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [9],
      nodeIds: [...visited],
      edgeIds: [...visitedEdges]
    },
    variables: { visited: [...visited], levels: levels.filter(l => l.length > 0).map((l, i) => `第${i}层:[${l.join(',')}]`).join(' ') },
    description: `层序遍历完成！各层节点：${levels.filter(l => l.length > 0).map((l, i) => `第${i}层:[${l.join(',')}]`).join(' ')}`
  };
}

const code = [
  'const queue = [root], result = [];',
  'while (queue.length > 0) {',
  '  const levelSize = queue.length;',
  '  for (let i = 0; i < levelSize; i++) {',
  '    const node = queue.shift();',
  '    result.push(node.val);',
  '    if (node.left) queue.push(node.left);',
  '    if (node.right) queue.push(node.right);',
  '  }',
  '}',
  'return result;'
];

module.exports = { meta, steps, code };
