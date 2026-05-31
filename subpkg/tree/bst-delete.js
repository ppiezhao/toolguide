const meta = {
  id: 'bst-delete',
  name: 'BST删除',
  nameEn: 'BST Delete',
  difficulty: 'hard',
  category: 'tree',
  tags: ['二叉树', 'BST', '删除'],
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(log n)',
  description: '在二叉搜索树中删除一个节点。分三种情况：叶子节点（直接删除）、只有一个子节点（用子节点替代）、有两个子节点（用中序后继替代）。',
  defaultInput: {
    type: 'tree',
    value: {
      val: 4,
      left: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } },
      right: { val: 6, left: { val: 5, left: null, right: null }, right: { val: 7, left: null, right: null } }
    },
    label: 'BST中删除值 6'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const tree = deepClone(input);
  const deleteVal = 6;
  const path = [];
  const pathEdges = [];

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { target: deleteVal, current: tree.val },
    description: `准备在 BST 中删除值 ${deleteVal}，从根节点 ${tree.val} 开始搜索`
  };

  // Find the node and its parent
  let curr = tree;
  let parent = null;

  while (curr !== null && curr.val !== deleteVal) {
    path.push(curr.val);
    parent = curr;

    if (deleteVal < curr.val) {
      if (curr.left) pathEdges.push(`${curr.val}->${curr.left.val}`);
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [2, 3],
          nodeIds: [...path],
          edgeIds: [...pathEdges]
        },
        variables: { target: deleteVal, current: curr.val, direction: 'left' },
        description: `${deleteVal} < ${curr.val}，向左查找`
      };
      curr = curr.left;
    } else {
      if (curr.right) pathEdges.push(`${curr.val}->${curr.right.val}`);
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [4, 5],
          nodeIds: [...path],
          edgeIds: [...pathEdges]
        },
        variables: { target: deleteVal, current: curr.val, direction: 'right' },
        description: `${deleteVal} > ${curr.val}，向右查找`
      };
      curr = curr.right;
    }
  }

  if (curr === null) {
    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: { codeLines: [14], nodeIds: [...path], edgeIds: [...pathEdges] },
      variables: { target: deleteVal, found: false },
      description: `值 ${deleteVal} 不在树中`
    };
    return;
  }

  path.push(curr.val);

  // Case 1: Leaf node
  if (curr.left === null && curr.right === null) {
    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [6, 7],
        nodeIds: [...path],
        edgeIds: [...pathEdges]
      },
      variables: { target: deleteVal, case: '叶子节点', children: '无' },
      description: `节点 ${deleteVal} 是叶子节点（无子节点），直接删除`
    };

    if (parent === null) {
      // Deleting root
    } else if (parent.left === curr) {
      parent.left = null;
    } else {
      parent.right = null;
    }

    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [8, 9],
        nodeIds: path.filter(v => v !== deleteVal),
        edgeIds: pathEdges.filter(e => !e.includes(`${deleteVal}->`))
      },
      variables: { target: deleteVal, result: '已删除叶子节点' },
      description: `叶子节点 ${deleteVal} 已被删除`
    };
    return;
  }

  // Case 2: One child
  if (curr.left === null || curr.right === null) {
    const child = curr.left !== null ? curr.left : curr.right;
    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [10, 11],
        nodeIds: [...path, child.val],
        edgeIds: [...pathEdges, `${curr.val}->${child.val}`]
      },
      variables: { target: deleteVal, case: '一个子节点', child: child.val },
      description: `节点 ${deleteVal} 有一个子节点 ${child.val}，用子节点替代`
    };

    if (parent === null) {
      // delete root
    } else if (parent.left === curr) {
      parent.left = child;
    } else {
      parent.right = child;
    }

    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [12, 13],
        nodeIds: path.filter(v => v !== deleteVal).concat([child.val]),
        edgeIds: pathEdges.filter(e => !e.includes(`${deleteVal}->`))
      },
      variables: { target: deleteVal, replaced_by: child.val },
      description: `节点 ${deleteVal} 已被子节点 ${child.val} 替代`
    };
    return;
  }

  // Case 3: Two children
  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [14, 15],
      nodeIds: [...path],
      edgeIds: [...pathEdges]
    },
    variables: { target: deleteVal, case: '两个子节点' },
    description: `节点 ${deleteVal} 有两个子节点，需要找中序后继（右子树的最小节点）`
  };

  // Find inorder successor (smallest in right subtree)
  let successorParent = curr;
  let successor = curr.right;
  const successorPath = [...path];

  while (successor.left !== null) {
    successorPath.push(successor.val);
    successorParent = successor;
    successor = successor.left;
  }
  successorPath.push(successor.val);

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [16, 17],
      nodeIds: [...successorPath],
      edgeIds: [...pathEdges, ...successorPath.slice(0, -1).map((v, i) => `${v}->${successorPath[i + 1]}`)]
    },
    variables: { target: deleteVal, successor: successor.val, successor_parent: successorParent.val },
    description: `找到中序后继节点 ${successor.val}（右子树中最小的节点）`
  };

  // Replace curr's value with successor's value
  curr.val = successor.val;

  // Delete the successor
  if (successorParent === curr) {
    successorParent.right = successor.right;
  } else {
    successorParent.left = successor.right;
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [18, 19],
      nodeIds: [...path.filter(v => v !== deleteVal), successor.val],
      edgeIds: [...pathEdges.filter(e => !e.includes(`->${deleteVal}`))]
    },
    variables: { target: deleteVal, replaced_with: successor.val, info: '中序后继的值被复制到当前位置，原后继节点被删除' },
    description: `节点 ${deleteVal} 被替换为中序后继 ${successor.val}，并删除原后继节点`
  };

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [20],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { result: `已删除节点 ${deleteVal}` },
    description: `删除完成！节点 ${deleteVal} 已从BST中删除`
  };
}

const code = [
  'function deleteNode(root, key) {',
  '  if (root === null) return null;',
  '  if (key < root.val) root.left = deleteNode(root.left, key);',
  '  else if (key > root.val) root.right = deleteNode(root.right, key);',
  '  else {',
  '    if (root.left === null && root.right === null) return null;',
  '    if (root.left === null) return root.right;',
  '    if (root.right === null) return root.left;',
  '    let succ = root.right;',
  '    while (succ.left !== null) succ = succ.left;',
  '    root.val = succ.val;',
  '    root.right = deleteNode(root.right, succ.val);',
  '  }',
  '  return root;',
  '}'
];

module.exports = { meta, steps, code };
