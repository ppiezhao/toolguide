/**
 * MatrixRenderer - 矩阵/DP 表格渲染器（占位，阶段 4 完整实现）
 *
 * 用于 DP 表格、网格遍历等算法的可视化。
 *
 * @extends CanvasRenderer
 */
const CanvasRenderer = require('./CanvasRenderer.js');
const COLOR = require('../utils/ColorPalette.js');

class MatrixRenderer extends CanvasRenderer {
  constructor(canvasId, width, height) {
    super(canvasId, width, height);
    this.padding = { top: 16, right: 16, bottom: 16, left: 16 };
    this.minCellSize = 28;
  }

  /**
   * @param {Object} data       - { type: 'matrix', value: number[][], rowLabels?, colLabels? }
   * @param {Object} highlights - { matrixCells: [[r,c],...], computedCells: [[r,c],...] }
   */
  render(data, highlights) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const matrix = data.value;
    if (!matrix || matrix.length === 0) return;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, this.width, this.height);

    const rows = matrix.length;
    const cols = matrix[0].length;
    const maxCellW = (this.width - this.padding.left - this.padding.right) / cols;
    const maxCellH = (this.height - this.padding.top - this.padding.bottom) / rows;
    const cellSize = Math.max(this.minCellSize, Math.min(maxCellW, maxCellH, 48));

    const hl = highlights || {};
    const currentCells = hl.matrixCells || [];
    const computedCells = hl.computedCells || [];
    const compareCells = hl.compareCells || [];

    const cellSet = new Set();
    for (const [r, c] of currentCells) cellSet.add(`${r},${c}`);
    const computedSet = new Set();
    for (const [r, c] of computedCells) computedSet.add(`${r},${c}`);
    const compareSet = new Set();
    for (const [r, c] of compareCells) compareSet.add(`${r},${c}`);

    const offsetX = this.padding.left + (this.width - this.padding.left - this.padding.right - cols * cellSize) / 2;
    const offsetY = this.padding.top + (this.height - this.padding.top - this.padding.bottom - rows * cellSize) / 2;

    const fontSize = Math.max(10, Math.min(14, cellSize * 0.4));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offsetX + c * cellSize;
        const y = offsetY + r * cellSize;
        const key = `${r},${c}`;

        let bgColor = COLOR.MATRIX_CELL;
        if (cellSet.has(key)) bgColor = COLOR.MATRIX_CELL_CURRENT;
        else if (computedSet.has(key)) bgColor = COLOR.MATRIX_CELL_COMPUTED;
        else if (compareSet.has(key)) bgColor = COLOR.MATRIX_CELL_COMPARE;

        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = COLOR.MATRIX_BORDER;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cellSize, cellSize);

        const val = matrix[r][c];
        ctx.fillStyle = val === null || val === undefined || val === '' ? '#CCC' : COLOR.TEXT_PRIMARY;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val === undefined || val === null ? '-' : String(val), x + cellSize / 2, y + cellSize / 2);
      }
    }
  }
}

module.exports = MatrixRenderer;
