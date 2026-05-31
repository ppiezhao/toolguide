/**
 * code-panel 组件 - 伪代码展示面板
 *
 * 属性:
 *   codeLines        - string[]  代码行数组
 *   highlightedLines - number[]  当前高亮的行索引
 */
Component({
  properties: {
    codeLines: { type: Array, value: [] },
    highlightedLines: { type: Array, value: [] }
  }
});
