/**
 * ColorPalette - 统一的配色方案
 * 延续 App 主题色 #07C160（微信绿）
 */
module.exports = {
  // 柱状图
  DEFAULT_BAR:    '#07C160',  // 默认绿色
  COMPARE:        '#4A90D9',  // 比较中（蓝）
  SWAP:           '#E64340',  // 交换中（红）
  SORTED:         '#2E8B57',  // 已排序（深绿）
  PIVOT:          '#FFB800',  // 枢轴（琥珀）
  CURRENT:        '#FF8C00',  // 当前焦点（橙）
  MARKED:         '#9B59B6',  // 标记（紫）

  // 树/图节点
  NODE_DEFAULT:   '#E8F5E9',  // 默认节点填充
  NODE_ACTIVE:    '#07C160',  // 活跃节点
  NODE_VISITED:   '#A5D6A7',  // 已访问
  NODE_QUEUE:     '#90CAF9',  // 队列中
  NODE_ROOT:      '#FFB800',  // 根节点

  // 边
  EDGE_DEFAULT:   '#CCCCCC',  // 默认边
  EDGE_ACTIVE:    '#07C160',  // 活跃边
  EDGE_TREE:      '#BDBDBD',  // 树边

  // 代码面板
  CODE_BG_DEFAULT: '#FFFFFF',
  CODE_BG_ACTIVE:  '#E8F5E9',

  // 变量面板
  VARIABLE_CHANGED: '#E64340',

  // 矩阵
  MATRIX_CELL:      '#FFFFFF',
  MATRIX_CELL_COMPUTED: '#C8E6C9',
  MATRIX_CELL_CURRENT:  '#FFB800',
  MATRIX_CELL_COMPARE:  '#90CAF9',
  MATRIX_BORDER:    '#E0E0E0',

  // 链表
  LINK_DEFAULT:     '#BDBDBD',
  LINK_POINTER:     '#4A90D9',

  // 文字
  TEXT_PRIMARY:     '#333333',
  TEXT_SECONDARY:   '#999999',
  TEXT_LIGHT:       '#FFFFFF',

  // 难度
  DIFFICULTY_EASY:   '#07C160',
  DIFFICULTY_MEDIUM: '#FFB800',
  DIFFICULTY_HARD:   '#E64340',

  // 指针
  POINTER_A: '#E64340',
  POINTER_B: '#4A90D9'
};
