/**
 * LinkedListRenderer - 链表渲染器
 *
 * 将链表节点渲染为水平链式结构，支持节点高亮和指针标注。
 *
 * @extends CanvasRenderer
 */
const CanvasRenderer = require('./CanvasRenderer.js');
const COLOR = require('../utils/ColorPalette.js');

class LinkedListRenderer extends CanvasRenderer {
  constructor(canvasId, width, height) {
    super(canvasId, width, height);
    this.nodeW = 48;
    this.nodeH = 32;
    this.arrowLen = 24;
    this.nodeGap = 16;
  }

  /**
   * @param {Object} data       - { type: 'linkedlist', value: { head, nodes: [...] } }
   *   nodes[i] = { val, next?, x?, y?, highlight? }
   * @param {Object} highlights - { nodeIds: [], pointerPositions: { name: index, color } }
   */
  render(data, highlights) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const nodes = data.value && data.value.nodes ? data.value.nodes : [];
    if (nodes.length === 0) return;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, this.width, this.height);

    const hl = highlights || {};
    const hlNodeIds = hl.nodeIds || [];
    const pointerPositions = hl.pointerPositions || [];

    // 计算布局（如果节点没有 x/y）
    const totalW = nodes.length * this.nodeW + (nodes.length - 1) * (this.arrowLen + this.nodeGap);
    const startX = Math.max(12, (this.width - totalW) / 2);
    const y = this.height / 2;

    // 计算每个节点位置
    const positions = [];
    let currentX = startX;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const x = node.x !== undefined ? node.x : currentX;
      const ny = node.y !== undefined ? node.y : y;
      positions.push({ x, y: ny, node });
      if (i < nodes.length - 1) {
        currentX = x + this.nodeW + this.arrowLen + this.nodeGap;
      }
    }

    // 绘制指针标注（在节点上方）
    const ptrY = positions.length > 0 ? positions[0].y - this.nodeH - 16 : 30;
    pointerPositions.forEach((ptr, idx) => {
      if (ptr.index < 0 || ptr.index >= positions.length) return;
      const px = positions[ptr.index].x + this.nodeW / 2;
      const color = ptr.color || COLOR.POINTER_A;
      const label = ptr.name || 'p';

      // 向下箭头
      ctx.beginPath();
      ctx.moveTo(px, ptrY);
      ctx.lineTo(px, positions[ptr.index].y - this.nodeH / 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 箭头
      ctx.beginPath();
      ctx.moveTo(px, ptrY);
      ctx.lineTo(px - 5, ptrY + 6);
      ctx.moveTo(px, ptrY);
      ctx.lineTo(px + 5, ptrY + 6);
      ctx.stroke();

      // 标签
      ctx.fillStyle = color;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(label, px, ptrY - 2);
    });

    // 绘制节点和箭头
    for (let i = 0; i < positions.length; i++) {
      const { x, y: ny, node } = positions[i];
      const isHighlighted = hlNodeIds.includes(i);

      // 节点到下一个节点的箭头
      if (i < positions.length - 1 && node.next !== null) {
        const nextPos = positions[i + 1];
        const arrowStartX = x + this.nodeW;
        const arrowEndX = nextPos.x;
        const arrowY = ny;

        ctx.beginPath();
        ctx.moveTo(arrowStartX, arrowY);
        ctx.lineTo(arrowEndX - 4, arrowY);
        ctx.strokeStyle = isHighlighted ? COLOR.EDGE_ACTIVE : COLOR.EDGE_DEFAULT;
        ctx.lineWidth = 2;
        ctx.stroke();

        // 箭头头部
        ctx.beginPath();
        ctx.moveTo(arrowEndX, arrowY);
        ctx.lineTo(arrowEndX - 8, arrowY - 4);
        ctx.lineTo(arrowEndX - 8, arrowY + 4);
        ctx.closePath();
        ctx.fillStyle = isHighlighted ? COLOR.EDGE_ACTIVE : COLOR.EDGE_DEFAULT;
        ctx.fill();
      }

      // 如果 node.next === null，画最后一个节点到 NULL 的箭头
      if (i === positions.length - 1 && node.next === null) {
        const nullX = x + this.nodeW + 8;
        ctx.beginPath();
        ctx.moveTo(x + this.nodeW, ny);
        ctx.lineTo(nullX + 10, ny);
        ctx.strokeStyle = COLOR.EDGE_DEFAULT;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#999';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('NULL', nullX + 16, ny + 1);
      }

      // 绘制节点
      const bgColor = isHighlighted ? COLOR.NODE_ACTIVE : '#FFFFFF';
      const borderColor = isHighlighted ? COLOR.NODE_ACTIVE : '#07C160';
      this.drawRoundRect(x, ny - this.nodeH / 2, this.nodeW, this.nodeH, 6, bgColor, borderColor);

      // 节点值
      ctx.fillStyle = isHighlighted ? '#FFFFFF' : COLOR.TEXT_PRIMARY;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(node.val !== undefined ? node.val : '?'), x + this.nodeW / 2, ny);
    }
  }
}

module.exports = LinkedListRenderer;
