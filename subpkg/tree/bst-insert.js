const meta = {
  id: 'bst-insert',
  name: 'BST插入',
  nameEn: 'BST Insert',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', 'BST', '搜索'],
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1)',
  description: '在二叉搜索树中插入一个新值。从根节点开始，根据大小比较决定向左或向右查找，找到空位后插入。',
  defaultInput: {
    type: 'tree',
    value: {
      val: 4,
      left: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } },
      right: { val: 6, left: { val: 5, left: null, right: null }, right: { val: 7, left: null, right: null } }
    },
    label: 'BST中插入值 8'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const tree = deepClone(input);
  const insertVal = 8;
  const path = [];
  const pathEdges = [];

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { insert: insertVal, current: tree.val },
    description: `准备在 BST 中插入值 ${insertVal}，从根节点 ${tree.val} 开始`
  };

  let curr = tree;
  let parent = null;

  while (curr !== null) {
    path.push(curr.val);
    parent = curr;

    if (insertVal < curr.val) {
      if (parent.left !== null && path.length > 1) {
        pathEdges.push(`${parent.val}->${parent.left.val}`);
      }
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [2, 3],
          nodeIds: [...path],
          edgeIds: [...pathEdges]
        },
        variables: { insert: insertVal, current: curr.val, direction: 'left', compare: `${insertVal} < ${curr.val}` },
        description: `${insertVal} < ${curr.val}，向左子树查找`
      };
      curr = curr.left;
    } else if (insertVal > curr.val) {
      if (parent.right !== null && path.length > 1) {
        pathEdges.push(`${parent.val}->${parent.right.val}`);
      }
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [4, 5],
          nodeIds: [...path],
          edgeIds: [...pathEdges]
        },
        variables: { insert: insertVal, current: curr.val, direction: 'right', compare: `${insertVal} > ${curr.val}` },
        description: `${insertVal} > ${curr.val}，向右子树查找`
      };
      curr = curr.right;
    } else {
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [8],
          nodeIds: [...path],
          edgeIds: [...pathEdges]
        },
        variables: { insert: insertVal, current: curr.val },
        description: `${insertVal} 已存在于树中`
      };
      return;
    }
  }

  // Insert new node
  const newNode = { val: insertVal, left: null, right: null };
  if (insertVal < parent.val) {
    parent.left = newNode;
  } else {
    parent.right = newNode;
  }

  path.push(insertVal);
  pathEdges.push(`${parent.val}->${insertVal}`);

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [6, 7],
      nodeIds: [...path],
      edgeIds: [...pathEdges]
    },
    variables: { insert: insertVal, parent: parent.val, position: insertVal < parent.val ? '左子节点' : '右子节点' },
    description: `在节点 ${parent.val} 的${insertVal < parent.val ? '左' : '右'}侧插入新节点 ${insertVal}`
  };

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [9],
      nodeIds: [...path],
      edgeIds: [...pathEdges]
    },
    variables: { insert: insertVal, result: `插入成功` },
    description: `值 ${insertVal} 插入完成！搜索路径：${path.join(' -> ')}`
  };
}

const code = [
  'let curr = root, parent = null;',
  'while (curr !== null) {',
  '  parent = curr;',
  '  if (val < curr.val) curr = curr.left;',
  '  else if (val > curr.val) curr = curr.right;',
  '  else return; // 已存在',
  '}',
  'if (val < parent.val) parent.left = { val, left: null, right: null };',
  'else parent.right = { val, left: null, right: null };',
  'return root;'
];

module.exports = { meta, steps, code };
