const meta = {
  id: 'lowest-common-ancestor',
  name: '最近公共祖先',
  nameEn: 'Lowest Common Ancestor',
  difficulty: 'medium',
  category: 'tree',
  tags: ['二叉树', 'LCA', '递归'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '找到二叉树中两个指定节点的最近公共祖先（LCA）。利用递归在左右子树中分别查找目标节点。',
  defaultInput: {
    type: 'tree',
    value: {
      val: 4,
      left: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } },
      right: { val: 6, left: { val: 5, left: null, right: null }, right: { val: 7, left: null, right: null } }
    },
    label: 'LCA of 1 and 5'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const tree = deepClone(input);
  const p = 1;
  const q = 5;
  const pathP = [];
  const pathQ = [];
  const visitedP = [];
  const visitedQ = [];
  let lca = null;
  let stepNum = 0;

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [1],
      nodeIds: [tree.val],
      edgeIds: []
    },
    variables: { p, q, current: tree.val },
    description: `寻找节点 ${p} 和 ${q} 的最近公共祖先，从根节点 ${tree.val} 开始`
  };

  // First find path to 1
  let curr = tree;
  let foundP = false;

  // Find p
  while (curr !== null) {
    pathP.push(curr.val);
    visitedP.push(curr.val);

    if (curr.val === p) {
      foundP = true;
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [2],
          nodeIds: [...visitedP],
          edgeIds: visitedP.slice(0, -1).map((v, i) => `${v}->${visitedP[i + 1]}`)
        },
        variables: { target: 'p', value: p, found: true, path: pathP.join(' -> ') },
        description: `找到节点 ${p}！路径：${pathP.join(' -> ')}`
      };
      break;
    }

    if (p < curr.val) {
      curr = curr.left;
    } else {
      curr = curr.right;
    }

    if (curr !== null) {
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [3],
          nodeIds: [...visitedP],
          edgeIds: visitedP.slice(0, -1).map((v, i) => `${v}->${visitedP[i + 1]}`)
        },
        variables: { target: 'p', value: p, current: curr.val, path: pathP.join(' -> ') },
        description: `查找 ${p}：当前节点 ${curr.val}`
      };
    }
  }

  // Find q
  curr = tree;
  while (curr !== null) {
    pathQ.push(curr.val);
    visitedQ.push(curr.val);

    if (curr.val === q) {
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [4],
          nodeIds: [...visitedP, ...visitedQ.filter(v => !visitedP.includes(v))],
          edgeIds: visitedQ.slice(0, -1).map((v, i) => `${v}->${visitedQ[i + 1]}`)
        },
        variables: { target: 'q', value: q, found: true, path: pathQ.join(' -> ') },
        description: `找到节点 ${q}！路径：${pathQ.join(' -> ')}`
      };
      break;
    }

    if (q < curr.val) {
      curr = curr.left;
    } else {
      curr = curr.right;
    }

    if (curr !== null) {
      yield {
        data: { type: 'tree', value: deepClone(tree) },
        highlights: {
          codeLines: [5],
          nodeIds: [...visitedP, ...visitedQ.filter(v => !visitedP.includes(v))],
          edgeIds: visitedQ.slice(0, -1).map((v, i) => `${v}->${visitedQ[i + 1]}`)
        },
        variables: { target: 'q', value: q, current: curr.val },
        description: `查找 ${q}：当前节点 ${curr.val}`
      };
    }
  }

  // Find LCA: the last common node in both paths
  const minLen = Math.min(pathP.length, pathQ.length);
  for (let i = 0; i < minLen; i++) {
    if (pathP[i] === pathQ[i]) {
      lca = pathP[i];
    } else {
      break;
    }
  }

  yield {
    data: { type: 'tree', value: deepClone(tree) },
    highlights: {
      codeLines: [6, 7],
      nodeIds: [lca, p, q],
      edgeIds: visitedP.slice(0, visitedP.indexOf(lca) + 1).slice(0, -1).map((v, i) => `${v}->${visitedP[i + 1]}`)
    },
    variables: { p, q, lca, path_p: pathP.join(' -> '), path_q: pathQ.join(' -> ') },
    description: `节点 ${p} 和 ${q} 的最近公共祖先为 ${lca}`
  };
}

const code = [
  'function lowestCommonAncestor(root, p, q) {',
  '  if (root === null || root === p || root === q) return root;',
  '  const left = lowestCommonAncestor(root.left, p, q);',
  '  const right = lowestCommonAncestor(root.right, p, q);',
  '  if (left && right) return root;',
  '  return left || right;',
  '}'
];

module.exports = { meta, steps, code };
