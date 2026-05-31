const meta = {
  id: 'binary-tree-right-side-view',
  name: '右视图',
  nameEn: 'Binary Tree Right Side View',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', 'BFS', '层序遍历'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '返回从二叉树右侧能看到的节点值。使用层序遍历（BFS），每层最后一个节点即为右视图可见节点。',
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
  const rightView = [];
  const visited = [];
  const visitedEdges = [];
  let level = 0;
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { level: 0, queue: [tree.val], right_view: [] },
    description: '初始化队列，开始层序遍历。每层最后一个节点即为右视图节点。'
  };

  while (queue.length > 0) {
    const levelSize = queue.length;
    let lastNodeVal = null;

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      stepNum++;
      visited.push(node.val);
      lastNodeVal = node.val;

      if (visited.length > 1) {
        visitedEdges.push(`${visited[visited.length - 2]}->${node.val}`);
      }

      if (node.left !== null) {
        queue.push(node.left);
        yield {
          data: { type: 'tree', value: deepClone(tree) },
          highlights: {
            codeLines: [3, 4],
            nodeIds: [...visited],
            edgeIds: [...visitedEdges]
          },
          variables: { level, visiting: node.val, queue: queue.map(n => n.val), right_view: [...rightView] },
          description: `第 ${level} 层访问节点 ${node.val}，左子节点 ${node.left.val} 入队`
        };
      }

      if (node.right !== null) {
        queue.push(node.right);
        yield {
          data: { type: 'tree', value: deepClone(tree) },
          highlights: {
            codeLines: [5, 6],
            nodeIds: [...visited],
            edgeIds: [...visitedEdges]
          },
          variables: { level, visiting: node.val, queue: queue.map(n => n.val), right_view: [...rightView] },
          description: `第 ${level} 层访问节点 ${node.val}，右子节点 ${node.right.val} 入队`
        };
      }
    }

    rightView.push(lastNodeVal);
    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [7, 8],
        nodeIds: [...visited],
        edgeIds: [...visitedEdges]
      },
      variables: { level, last_node: lastNodeVal, right_view: [...rightView] },
      description: `第 ${level} 层从右可见节点为 ${lastNodeVal}，当前右视图：[${rightView.join(', ')}]`
    };

    level++;
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [9],
      nodeIds: [...visited],
      edgeIds: [...visitedEdges]
    },
    variables: { right_view: [...rightView], result: rightView.join(' -> ') },
    description: `右视图完成！从右侧可见节点依次为：${rightView.join(' -> ')}`
  };
}

const code = [
  'const queue = [root], result = [];',
  'while (queue.length > 0) {',
  '  const levelSize = queue.length;',
  '  for (let i = 0; i < levelSize; i++) {',
  '    const node = queue.shift();',
  '    if (node.left) queue.push(node.left);',
  '    if (node.right) queue.push(node.right);',
  '    if (i === levelSize - 1) result.push(node.val);',
  '  }',
  '}',
  'return result;'
];

module.exports = { meta, steps, code };
