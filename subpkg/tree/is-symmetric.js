const meta = {
  id: 'symmetric-tree',
  name: '判断对称二叉树',
  nameEn: 'Symmetric Tree',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', '递归', '对称'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '判断一棵二叉树是否为镜像对称的。递归比较左子树和右子树是否互为镜像。',
  defaultInput: {
    type: 'tree',
    value: {
      val: 1,
      left: { val: 2, left: { val: 3, left: null, right: null }, right: { val: 4, left: null, right: null } },
      right: { val: 2, left: { val: 4, left: null, right: null }, right: { val: 3, left: null, right: null } }
    },
    label: '对称二叉树 [1,2,2,3,4,4,3]'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const tree = deepClone(input);
  const compared = [];
  const comparedEdges = [];
  let isSymmetric = true;
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { root: tree.val, checking: '左右子树是否互为镜像' },
    description: `从根节点 ${tree.val} 开始，比较左子树和右子树是否互为镜像`
  };

  // BFS comparison using queue of pairs
  const queue = [{ left: tree.left, right: tree.right }];

  while (queue.length > 0) {
    const { left, right } = queue.shift();

    if (left === null && right === null) {
      stepNum++;
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [2],
          nodeIds: [...compared],
          edgeIds: [...comparedEdges]
        },
        variables: { step: stepNum, left: 'null', right: 'null', match: true },
        description: `第 ${stepNum} 步：两个子节点都为 null，对称`
      };
      continue;
    }

    if (left === null || right === null) {
      stepNum++;
      isSymmetric = false;
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [3, 4],
          nodeIds: [...compared],
          edgeIds: [...comparedEdges]
        },
        variables: { step: stepNum, left: left?.val ?? 'null', right: right?.val ?? 'null', match: false },
        description: `第 ${stepNum} 步：一个为 null，一个不为 null，不对称！`
      };
      break;
    }

    stepNum++;
    compared.push(left.val, right.val);
    if (left.val !== right.val) {
      isSymmetric = false;
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [5, 6],
          nodeIds: [...new Set(compared)],
          edgeIds: [...comparedEdges]
        },
        variables: { step: stepNum, left_val: left.val, right_val: right.val, match: false },
        description: `第 ${stepNum} 步：${left.val} !== ${right.val}，值不相同，不对称！`
      };
      break;
    }

    yield {
      data: { type: 'tree', value: deepClone(tree) },
      highlights: {
        codeLines: [5],
        nodeIds: [...new Set(compared)],
        edgeIds: [...comparedEdges]
      },
      variables: { step: stepNum, left_val: left.val, right_val: right.val, match: true },
      description: `第 ${stepNum} 步：${left.val} === ${right.val}，值相同，继续比较`
    };

    // Push in mirrored order
    queue.push({ left: left.left, right: right.right });
    queue.push({ left: left.right, right: right.left });
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [7],
      nodeIds: [...new Set(compared), tree.val],
      edgeIds: [...comparedEdges]
    },
    variables: { is_symmetric: isSymmetric ? '是' : '否' },
    description: isSymmetric ? '该二叉树是对称的！' : '该二叉树不是对称的！'
  };
}

const code = [
  'function isSymmetric(root) {',
  '  function check(left, right) {',
  '    if (left === null && right === null) return true;',
  '    if (left === null || right === null) return false;',
  '    if (left.val !== right.val) return false;',
  '    return check(left.left, right.right) && check(left.right, right.left);',
  '  }',
  '  return check(root.left, root.right);',
  '}'
];

module.exports = { meta, steps, code };
