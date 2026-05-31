/**
 * BarChartRenderer - 柱状图渲染器
 *
 * 用于排序、搜索等需要可视化数组的算法。
 * 将数组元素渲染为柱状图，根据 highlights 对柱子着色。
 *
 * @extends CanvasRenderer
 */
const CanvasRenderer = require('./CanvasRenderer.js');
const COLOR = require('../utils/ColorPalette.js');

class BarChartRenderer extends CanvasRenderer {
  constructor(canvasId, width, height) {
    super(canvasId, width, height);
    this.padding = { top: 30, right: 12, bottom: 36, left: 12 };
    this.barGap = 4;
  }

  /**
   * @param {Object} data       - { type: 'array', value: number[] }
   * @param {Object} highlights - { compareIndices, swapIndices, dataIndices, sortedIndices, pivotIndices }
   */
  render(data, highlights) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const arr = data.value;
    const n = arr.length;
    if (n === 0) return;

    const chartW = this.width - this.padding.left - this.padding.right;
    const chartH = this.height - this.padding.top - this.padding.bottom;
    const maxVal = Math.max(...arr, 1);
    const barW = n <= 1
      ? chartW * 0.5
      : (chartW - this.barGap * (n - 1)) / n;
    const totalBarsW = n * barW + (n - 1) * this.barGap;
    const offsetX = this.padding.left + (chartW - totalBarsW) / 2;

    ctx.clearRect(0, 0, this.width, this.height);
    // 背景
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, this.width, this.height);

    const hl = highlights || {};
    const { compareIndices = [], swapIndices = [], dataIndices = [],
            sortedIndices = [], pivotIndices = [] } = hl;

    // 计算字体大小（柱子宽度的 80%，最小 9px，最大 14px）
    const fontSize = Math.max(9, Math.min(14, barW * 0.75));

    arr.forEach((val, i) => {
      const barH = (val / maxVal) * chartH;
      const x = offsetX + i * (barW + this.barGap);
      const y = this.padding.top + chartH - barH;

      // 颜色判定优先级：交换 > 枢轴 > 比较 > 当前 > 已排序 > 默认
      let fillColor = COLOR.DEFAULT_BAR;
      if (swapIndices.includes(i)) {
        fillColor = COLOR.SWAP;
      } else if (pivotIndices.includes(i)) {
        fillColor = COLOR.PIVOT;
      } else if (compareIndices.includes(i)) {
        fillColor = COLOR.COMPARE;
      } else if (dataIndices.includes(i)) {
        fillColor = COLOR.CURRENT;
      } else if (sortedIndices.includes(i)) {
        fillColor = COLOR.SORTED;
      }

      // 绘制柱子（带轻微圆角顶部）
      const radius = Math.min(3, barW / 3);
      ctx.fillStyle = fillColor;
      this._roundedBar(x, y, barW, barH, radius, fillColor);

      // 数值标签
      ctx.fillStyle = COLOR.TEXT_PRIMARY;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(val), x + barW / 2, y - 2);

      // 索引标签
      ctx.fillStyle = COLOR.TEXT_SECONDARY;
      ctx.font = `${Math.max(9, fontSize - 1)}px sans-serif`;
      ctx.textBaseline = 'top';
      ctx.fillText(String(i), x + barW / 2, this.padding.top + chartH + 6);
    });
  }

  _roundedBar(x, y, w, h, r, color) {
    const ctx = this.ctx;
    if (h <= r * 2) {
      // 太矮直接画矩形
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
}

module.exports = BarChartRenderer;
