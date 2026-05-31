/**
 * GraphRenderer - 图渲染器
 *
 * 使用圆形布局渲染图节点和边，支持节点/边高亮和权重标注。
 *
 * @extends CanvasRenderer
 */
const CanvasRenderer = require('./CanvasRenderer.js');
const LayoutEngine = require('./LayoutEngine.js');
const COLOR = require('../utils/ColorPalette.js');

class GraphRenderer extends CanvasRenderer {
  constructor(canvasId, width, height) {
    super(canvasId, width, height);
    this.nodeRadius = 16;
    this.padding = 30;
  }

  /**
   * @param {Object} data       - { type: 'graph', value: { nodes: GraphNode[], edges: GraphEdge[] } }
   *   GraphNode = { id, label, x?, y? }
   *   GraphEdge = { from, to, weight?, highlight? }
   * @param {Object} highlights - { nodeIds: string[], edgeIds: string[], visitedNodeIds: string[] }
   */
  render(data, highlights) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const graph = data.value;
    if (!graph || !graph.nodes || graph.nodes.length === 0) {
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#999';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('(空图)', this.width / 2, this.height / 2);
      return;
    }

    // 自动布局
    let nodes = graph.nodes;
    const needsLayout = !nodes[0].x || !nodes[0].y;
    if (needsLayout) {
      nodes = LayoutEngine.layoutGraphCircle(nodes, {
        width: this.width,
        height: this.height,
        padding: this.padding,
        nodeRadius: this.nodeRadius
      });
    }

    const hl = highlights || {};
    const hlNodeIds = new Set(hl.nodeIds || []);
    const hlEdgeIds = new Set(hl.edgeIds || []);
    const visitedNodeIds = new Set(hl.visitedNodeIds || []);
    const queueNodeIds = new Set(hl.queueNodeIds || []);

    // 构建节点查找表
    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n; });

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, this.width, this.height);

    // 绘制边
    const edges = graph.edges || [];
    edges.forEach((edge, idx) => {
      const from = nodeMap[edge.from];
      const to = nodeMap[edge.to];
      if (!from || !to) return;

      const edgeId = edge.id || `${edge.from}->${edge.to}`;
      const isHighlighted = edge.highlight || hlEdgeIds.has(edgeId);

      // 双向前处理（如果有两条边）
      const backEdge = edges.find((e, j) => j !== idx && e.from === edge.to && e.to === edge.from);
      const offset = backEdge ? 6 : 0;
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const offX = offset * Math.cos(angle + Math.PI / 2);
      const offY = offset * Math.sin(angle + Math.PI / 2);

      ctx.beginPath();
      ctx.moveTo(from.x + offX, from.y + offY);
      ctx.lineTo(to.x + offX, to.y + offY);
      ctx.strokeStyle = isHighlighted ? '#07C160' : COLOR.EDGE_DEFAULT;
      ctx.lineWidth = isHighlighted ? 2.5 : 1;
      ctx.stroke();

      // 权重标注
      if (edge.weight !== undefined && edge.weight !== null) {
        const midX = (from.x + to.x) / 2 + offX * 2;
        const midY = (from.y + to.y) / 2 + offY * 2;
        ctx.fillStyle = isHighlighted ? '#07C160' : '#999';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 背景
        const textW = ctx.measureText(String(edge.weight)).width + 6;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillRect(midX - textW / 2, midY - 8, textW, 16);
        ctx.fillStyle = isHighlighted ? '#07C160' : '#666';
        ctx.fillText(String(edge.weight), midX, midY);
      }
    });

    // 绘制节点
    nodes.forEach((node) => {
      const nid = node.id;
      const isActive = hlNodeIds.has(nid);
      const isVisited = visitedNodeIds.has(nid);
      const isQueued = queueNodeIds.has(nid);

      let fillColor = '#FFFFFF';
      let borderColor = '#07C160';
      let textColor = COLOR.TEXT_PRIMARY;

      if (isActive) {
        fillColor = COLOR.NODE_ACTIVE;
        borderColor = COLOR.NODE_ACTIVE;
        textColor = '#FFFFFF';
      } else if (isVisited) {
        fillColor = '#C8E6C9';
        borderColor = '#66BB6A';
      } else if (isQueued) {
        fillColor = '#BBDEFB';
        borderColor = '#64B5F6';
      }

      this.drawCircle(node.x, node.y, this.nodeRadius, fillColor, borderColor);

      ctx.fillStyle = textColor;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(node.label !== undefined ? node.label : node.id), node.x, node.y);
    });
  }
}

module.exports = GraphRenderer;
