/**
 * CanvasRenderer - Canvas 2D 渲染基类
 *
 * 所有可视化渲染器（BarChart/Tree/Graph/Matrix/LinkedList）的抽象基类。
 * 提供 canvas 初始化、清理和通用绘制工具方法。
 *
 * 子类必须实现 render(data, highlights) 方法。
 */
class CanvasRenderer {
  /**
   * @param {string} canvasId - canvas 元素的 id
   * @param {number} width    - 逻辑宽度 (rpx 换算后)
   * @param {number} height   - 逻辑高度 (rpx 换算后)
   */
  constructor(canvasId, width, height) {
    this.canvasId = canvasId;
    this.width = width;
    this.height = height;
    this.ctx = null;
    this.dpr = 1;
    this._canvas = null;
  }

  /**
   * 初始化 canvas 上下文
   * 需要在页面 onReady() 中调用（DOM 就绪后）
   * @returns {Promise}
   */
  init() {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery();
      query.select('#' + this.canvasId)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) {
            reject(new Error('Canvas not found: #' + this.canvasId));
            return;
          }
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          this.dpr = wx.getSystemInfoSync().pixelRatio;
          canvas.width = this.width * this.dpr;
          canvas.height = this.height * this.dpr;
          ctx.scale(this.dpr, this.dpr);
          this.ctx = ctx;
          this._canvas = canvas;
          resolve();
        });
    });
  }

  /**
   * 渲染一个步骤。子类必须实现。
   * @param {Object} data       - step.data 对象，形如 { type, value }
   * @param {Object} highlights - step.highlights 对象
   */
  render(data, highlights) {
    throw new Error('Subclass must implement render(data, highlights)');
  }

  /** 清空画布 */
  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // ─── 工具方法 ──────────────────────────────────────────────

  /** 绘制矩形 */
  drawRect(x, y, w, h, fillColor, strokeColor) {
    const ctx = this.ctx;
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, w, h);
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.strokeRect(x, y, w, h);
    }
  }

  /** 绘制圆角矩形 */
  drawRoundRect(x, y, w, h, r, fillColor, strokeColor) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }
  }

  /** 绘制圆形 */
  drawCircle(cx, cy, r, fillColor, strokeColor) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }
  }

  /** 绘制线段 */
  drawLine(x1, y1, x2, y2, color, lineWidth) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color || '#ccc';
    ctx.lineWidth = lineWidth || 1;
    ctx.stroke();
  }

  /** 绘制箭头 */
  drawArrow(x1, y1, x2, y2, color, lineWidth) {
    const ctx = this.ctx;
    const headLen = 8;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color || '#ccc';
    ctx.lineWidth = lineWidth || 1.5;
    ctx.stroke();

    // 箭头头部
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLen * Math.cos(angle - Math.PI / 6),
      y2 - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLen * Math.cos(angle + Math.PI / 6),
      y2 - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }

  /** 绘制文本 */
  drawText(text, x, y, color, font, align) {
    const ctx = this.ctx;
    ctx.fillStyle = color || '#333';
    ctx.font = font || '12px sans-serif';
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(text), x, y);
  }

  /** 绘制多行文本 */
  drawMultilineText(text, x, y, maxWidth, lineHeight, color, font, align) {
    const ctx = this.ctx;
    ctx.fillStyle = color || '#333';
    ctx.font = font || '12px sans-serif';
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'top';

    const lines = text.split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + i * lineHeight);
    });
  }

  /** 使用指定颜色填充整个画布背景 */
  fillBackground(color) {
    if (!this.ctx) return;
    this.ctx.fillStyle = color || '#FFFFFF';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
}

module.exports = CanvasRenderer;
