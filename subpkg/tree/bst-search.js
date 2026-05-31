const meta = {
  id: 'bst-search',
  name: 'BST搜索',
  nameEn: 'BST Search',
  difficulty: 'easy',
  category: 'tree',
  tags: ['二叉树', 'BST', '搜索'],
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1)',
  description: '在二叉搜索树中搜索目标值。根据BST性质，比较当前节点值与目标值，决定向左或向右查找。',
  defaultInput: {
    type: 'tree',
    value: {
      val: 4,
      left: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } },
      right: { val: 6, left: { val: 5, left: null, right: null }, right: { val: 7, left: null, right: null } }
    },
    label: 'BST中搜索值 5'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const tree = deepClone(input);
  const searchVal = 5;
  const path = [];
  const pathEdges = [];
  let found = false;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { target: searchVal, current: tree.val },
    description: `在 BST 中搜索值 ${searchVal}，从根节点 ${tree.val} 开始`
  };

  let curr = tree;
  while (curr !== null) {
    path.push(curr.val);
    if (path.length > 1) {
      pathEdges.push(`${path[path.length - 2]}->${curr.val}`);
    }

    if (searchVal === curr.val) {
      found = true;
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [2, 3],
          nodeIds: [...path],
          edgeIds: [...pathEdges]
        },
        variables: { target: searchVal, current: curr.val, found: true, path: path.join(' -> ') },
        description: `找到目标值 ${searchVal}！搜索路径：${path.join(' -> ')}`
      };
      break;
    }

    if (searchVal < curr.val) {
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [4, 5],
          nodeIds: [...path],
          edgeIds: [...pathEdges]
        },
        variables: { target: searchVal, current: curr.val, direction: '左', compare: `${searchVal} < ${curr.val}` },
        description: `${searchVal} < ${curr.val}，向左子树查找`
      };
      curr = curr.left;
    } else {
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [6, 7],
          nodeIds: [...path],
          edgeIds: [...pathEdges]
        },
        variables: { target: searchVal, current: curr.val, direction: '右', compare: `${searchVal} > ${curr.val}` },
        description: `${searchVal} > ${curr.val}，向右子树查找`
      };
      curr = curr.right;
    }
  }

  if (!found) {
    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [8],
        nodeIds: [...path],
        edgeIds: [...pathEdges]
      },
      variables: { target: searchVal, found: false, path: path.join(' -> ') },
      description: `值 ${searchVal} 不在树中。搜索路径：${path.join(' -> ')}`
    };
  }
}

const code = [
  'let curr = root;',
  'while (curr !== null) {',
  '  if (val === curr.val) return curr;',
  '  if (val < curr.val) curr = curr.left;',
  '  else curr = curr.right;',
  '}',
  'return null;'
];

module.exports = { meta, steps, code };
