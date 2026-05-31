const meta = {
  id: 'path-sum',
  name: '路径总和',
  nameEn: 'Path Sum',
  difficulty: 'easy',
  category: 'tree',
  tags: ['二叉树', 'DFS', '递归'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '判断二叉树是否存在一条从根节点到叶子节点的路径，使得路径上所有节点值之和等于目标值。',
  defaultInput: {
    type: 'tree',
    value: {
      val: 4,
      left: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } },
      right: { val: 6, left: { val: 5, left: null, right: null }, right: { val: 7, left: null, right: null } }
    },
    label: '二叉搜索树 [4,2,6,1,3,5,7], target=9'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const tree = deepClone(input);
  const target = 9;
  const visited = [];
  const visitedEdges = [];
  let found = false;
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { target, current: tree.val, sum: tree.val },
    description: `检查是否存在根到叶子的路径和等于 ${target}，从根节点 ${tree.val} 开始（当前和=${tree.val}）`
  };

  // DFS with stack that tracks sum and path
  const stack = [{ node: tree, sum: tree.val, path: [tree.val] }];

  while (stack.length > 0) {
    const { node, sum, path } = stack.pop();
    stepNum++;

    visited.push(node.val);
    if (path.length > 1) {
      visitedEdges.push(`${path[path.length - 2]}->${node.val}`);
    }

    // Check if leaf
    if (node.left === null && node.right === null) {
      if (sum === target) {
        found = true;
        yield {
          data: { type: 'tree', value: deepClone(tree) },
          highlights: {
            codeLines: [2, 3],
            nodeIds: [...path],
            edgeIds: path.slice(0, -1).map((v, i) => `${v}->${path[i + 1]}`)
          },
          variables: { path: path.join(' -> '), sum, target, found: true },
          description: `找到路径！${path.join(' -> ')} 的和为 ${sum}，等于目标值 ${target}`
        };
        break;
      } else {
        yield {
          data: { type: 'tree', value: deepClone(tree) },
          highlights: {
            codeLines: [4],
            nodeIds: [...visited],
            edgeIds: [...visitedEdges]
          },
          variables: { path: path.join(' -> '), sum, target, found: false },
          description: `路径 ${path.join(' -> ')} 和为 ${sum}，不等于 ${target}，回溯`
        };
      }
    } else {
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [5],
          nodeIds: [...visited],
          edgeIds: [...visitedEdges]
        },
        variables: { path: path.join(' -> '), sum, target, is_leaf: false },
        description: `当前路径 ${path.join(' -> ')}，和=${sum}，继续向下搜索`
      };
    }

    // Push children (right first so left processes first due to stack LIFO)
    if (node.right !== null) {
      stack.push({ node: node.right, sum: sum + node.right.val, path: [...path, node.right.val] });
    }
    if (node.left !== null) {
      stack.push({ node: node.left, sum: sum + node.left.val, path: [...path, node.left.val] });
    }
  }

  if (!found) {
    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [6],
        nodeIds: [...visited],
        edgeIds: [...visitedEdges]
      },
      variables: { target, found: false },
      description: `不存在根到叶子路径和等于 ${target}`
    };
  }
}

const code = [
  'function hasPathSum(root, targetSum) {',
  '  if (root === null) return false;',
  '  if (root.left === null && root.right === null) return root.val === targetSum;',
  '  return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val);',
  '}'
];

module.exports = { meta, steps, code };
