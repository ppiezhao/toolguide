/**
 * LayoutEngine - 树和图的自动布局计算工具
 *
 * 为 TreeNode 和 GraphNode 计算 (x, y) 渲染坐标。
 * 布局方法：
 *   - 二叉树：中序遍历分配 x，深度分配 y
 *   - 图：圆形布局，节点均匀分布在圆周上
 */

/**
 * 计算二叉树节点布局
 *
 * 算法：中序遍历确定每个节点的 x 顺序，深度确定 y。
 * 节点间距根据树宽度自适应。
 *
 * @param {TreeNode} root    - 二叉树根节点 { val, left, right }
 * @param {Object}   options - { width, height, padding, nodeRadius, hSpacing, vSpacing }
 * @returns {TreeNode} 根节点（已带 x, y 坐标，原地修改）
 */
function layoutTree(root, options = {}) {
  const {
    width = 300,
    height = 280,
    padding = 24,
    nodeRadius = 16,
    vSpacing = 50
  } = options;

  if (!root) return root;

  // 计算树深度
  const depth = getTreeDepth(root);
  const totalNodes = countNodes(root);

  // 可用宽度
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;

  // 根据节点数计算水平间距
  const hSpacing = Math.min(
    options.hSpacing || 40,
    Math.max(20, availableWidth / Math.max(totalNodes, 1))
  );

  // 中序遍历分配 x 坐标
  let xIndex = 0;
  const inorderSetX = (node, currDepth) => {
    if (!node) return;
    inorderSetX(node.left, currDepth + 1);
    node.x = padding + xIndex * hSpacing;
    node.y = padding + currDepth * vSpacing;
    xIndex++;
    inorderSetX(node.right, currDepth + 1);
  };
  inorderSetX(root, 0);

  return root;
}

/**
 * 计算图节点的圆形布局
 *
 * @param {GraphNode[]} nodes  - [{ id, label }]
 * @param {Object}      options - { width, height, radius }
 * @returns {GraphNode[]} 节点（已带 x, y 坐标）
 */
function layoutGraphCircle(nodes, options = {}) {
  const {
    width = 300,
    height = 280,
    nodeRadius = 18,
    padding = 30
  } = options;

  const cx = width / 2;
  const cy = height / 2;
  const graphRadius = Math.min(width, height) / 2 - padding - nodeRadius;
  const n = nodes.length;
  const angleStep = (2 * Math.PI) / Math.max(n, 1);

  return nodes.map((node, i) => {
    const angle = -Math.PI / 2 + i * angleStep; // 从顶部开始
    return Object.assign({}, node, {
      x: cx + graphRadius * Math.cos(angle),
      y: cy + graphRadius * Math.sin(angle)
    });
  });
}

/**
 * 获取同一深度的所有节点
 * @returns {TreeNode[][]} 按深度分组的节点数组
 */
function getNodesByDepth(root) {
  const groups = [];
  const traverse = (node, depth) => {
    if (!node) return;
    if (!groups[depth]) groups[depth] = [];
    groups[depth].push(node);
    traverse(node.left, depth + 1);
    traverse(node.right, depth + 1);
  };
  traverse(root, 0);
  return groups;
}

/** 计算树最大深度 */
function getTreeDepth(node) {
  if (!node) return 0;
  return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

/** 计算节点总数 */
function countNodes(node) {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

module.exports = {
  layoutTree,
  layoutGraphCircle,
  getNodesByDepth,
  getTreeDepth,
  countNodes
};
