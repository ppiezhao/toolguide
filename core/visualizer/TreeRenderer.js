/**
 * TreeRenderer - 二叉树渲染器
 *
 * 渲染二叉树节点（圆形）和边（连线），支持节点/边高亮。
 *
 * @extends CanvasRenderer
 */
const CanvasRenderer = require('./CanvasRenderer.js');
const LayoutEngine = require('./LayoutEngine.js');
const COLOR = require('../utils/ColorPalette.js');

class TreeRenderer extends CanvasRenderer {
  constructor(canvasId, width, height) {
    super(canvasId, width, height);
    this.nodeRadius = 18;
    this.padding = 28;
  }

  /**
   * @param {Object} data       - { type: 'tree', value: TreeNode }
   *   TreeNode = { val, left?, right?, x?, y?, highlight? }
   * @param {Object} highlights - { nodeIds: number[], edgeIds: string[] }
   *   nodeIds: 按值匹配的高亮节点值数组
   *   edgeIds: 高亮边标识 ["parentVal->childVal"]
   */
  render(data, highlights) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const root = data.value;
    if (!root) {
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#999';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('(空树)', this.width / 2, this.height / 2);
      return;
    }

    // 自动布局（如果节点没有 x/y）
    const needsLayout = !root.x || !root.y;
    if (needsLayout) {
      LayoutEngine.layoutTree(root, {
        width: this.width,
        height: this.height,
        padding: this.padding,
        nodeRadius: this.nodeRadius,
        vSpacing: 48
      });
    }

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, this.width, this.height);

    const hl = highlights || {};
    const hlNodeIds = hl.nodeIds || [];
    const hlEdgeIds = new Set(hl.edgeIds || []);

    // 先绘制边
    const drawEdges = (node) => {
      if (!node) return;
      if (node.left) {
        const edgeKey = `${node.val}->${node.left.val}`;
        const isHighlighted = hlEdgeIds.has(edgeKey);
        ctx.strokeStyle = isHighlighted ? '#07C160' : COLOR.EDGE_TREE;
        ctx.lineWidth = isHighlighted ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.left.x, node.left.y);
        ctx.stroke();

        // 箭头（如果需要）
        if (isHighlighted) {
          this._drawSmallArrow(node, node.left);
        }

        drawEdges(node.left);
      }
      if (node.right) {
        const edgeKey = `${node.val}->${node.right.val}`;
        const isHighlighted = hlEdgeIds.has(edgeKey);
        ctx.strokeStyle = isHighlighted ? '#07C160' : COLOR.EDGE_TREE;
        ctx.lineWidth = isHighlighted ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.right.x, node.right.y);
        ctx.stroke();

        if (isHighlighted) {
          this._drawSmallArrow(node, node.right);
        }

        drawEdges(node.right);
      }
    };
    drawEdges(root);

    // 再绘制节点
    const drawNodes = (node) => {
      if (!node) return;
      const isHighlighted = hlNodeIds.includes(node.val);

      if (node.highlight || isHighlighted) {
        // 高亮节点：填充绿色
        this.drawCircle(node.x, node.y, this.nodeRadius, COLOR.NODE_ACTIVE, COLOR.NODE_ACTIVE);
        ctx.fillStyle = '#FFFFFF';
      } else {
        this.drawCircle(node.x, node.y, this.nodeRadius, '#FFFFFF', '#07C160');
        ctx.fillStyle = COLOR.TEXT_PRIMARY;
      }

      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(node.val !== undefined ? node.val : '?'), node.x, node.y);

      drawNodes(node.left);
      drawNodes(node.right);
    };
    drawNodes(root);
  }

  _drawSmallArrow(from, to) {
    const ctx = this.ctx;
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const size = 5;

    ctx.fillStyle = '#07C160';
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(midX - size * Math.cos(angle - 0.5), midY - size * Math.sin(angle - 0.5));
    ctx.lineTo(midX - size * Math.cos(angle + 0.5), midY - size * Math.sin(angle + 0.5));
    ctx.closePath();
    ctx.fill();
  }
}

module.exports = TreeRenderer;
