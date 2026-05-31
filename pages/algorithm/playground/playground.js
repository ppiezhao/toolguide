/**
 * playground - 算法可视化播放页面
 *
 * 接收参数: id (算法id), category (分类名)
 * 集成: Player播放控制器 + Canvas渲染器 + 控制/代码/变量面板
 */

const Player = require('../../../core/engine/Player.js');
const BarChartRenderer = require('../../../core/visualizer/BarChartRenderer.js');
const MatrixRenderer = require('../../../core/visualizer/MatrixRenderer.js');
const LinkedListRenderer = require('../../../core/visualizer/LinkedListRenderer.js');
const TreeRenderer = require('../../../core/visualizer/TreeRenderer.js');
const GraphRenderer = require('../../../core/visualizer/GraphRenderer.js');

// 子包路径映射
const SUBPKG_MAP = {
  sorting:    '../../../subpkg/sorting/index',
  searching:  '../../../subpkg/searching/index',
  linkedlist: '../../../subpkg/linkedlist/index',
  tree:       '../../../subpkg/tree/index',
  graph:      '../../../subpkg/graph/index',
  dp:         '../../../subpkg/dp/index',
  'array-hash': '../../../subpkg/array-hash/index'
};

// 难度名称映射
const DIFFICULTY_NAMES = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
};

Page({
  data: {
    // 算法信息
    algorithmId: '',
    algorithmName: '',
    category: '',
    difficulty: '',
    difficultyName: '',
    timeComplexity: '',
    spaceComplexity: '',
    problemDescription: '',
    descExpanded: false,

    // Canvas
    canvasWidth: 0,
    canvasHeight: 0,

    // 播放状态
    playing: false,
    playerState: 'IDLE',
    speed: 800,

    // 步骤
    stepIndex: 0,
    totalSteps: 0,
    stepDescription: '',

    // 代码面板
    codeLines: [],
    highlightedLines: [],

    // 变量
    variables: {},

    // 加载状态
    loading: true,
    error: ''
  },

  onLoad(options) {
    const { id, category } = options;
    if (!id || !category) {
      this.setData({ error: '缺少算法参数', loading: false });
      return;
    }
    this.setData({ algorithmId: id, category });

    // 计算 canvas 尺寸
    const sysInfo = wx.getSystemInfoSync();
    const screenWidth = sysInfo.windowWidth;
    this.setData({
      canvasWidth: screenWidth - 48,   // 减去容器 padding 24*2
      canvasHeight: Math.min(300, screenWidth * 0.7)
    });

    this._loadAlgorithm();
  },

  onReady() {
    this._initCanvas();
  },

  onUnload() {
    if (this._player) {
      this._player.destroy();
      this._player = null;
    }
  },

  // ─── 初始化 ────────────────────────────────────────────────

  _loadAlgorithm() {
    const { category, algorithmId } = this.data;
    const subpkgPath = SUBPKG_MAP[category];
    if (!subpkgPath) {
      this.setData({ error: '未知分类: ' + category, loading: false });
      return;
    }

    try {
      const modules = require(subpkgPath);
      const algo = modules.find(m => m.meta && m.meta.id === algorithmId);
      if (!algo) {
        this.setData({ error: '未找到算法: ' + algorithmId, loading: false });
        return;
      }
      this._initAlgorithm(algo);
    } catch (e) {
      console.error('加载算法失败', e);
      this.setData({ error: '加载失败: ' + e.message, loading: false });
    }
  },

  _initAlgorithm(module) {
    const { meta, steps, code } = module;
    this._module = module;

    // 预运行 generator 获取总步骤数和所有步骤
    const gen = steps(meta.defaultInput);
    const allSteps = [];
    for (const s of gen) { allSteps.push(s); }

    // 创建渲染器
    const { canvasWidth, canvasHeight } = this.data;
    this._renderer = this._createRenderer(meta.defaultInput.type, canvasWidth, canvasHeight);

    // 创建播放器（用一个新的 generator）
    const generator = steps(meta.defaultInput);
    this._player = new Player({
      generator,
      onStep: (step, index, total) => this._onStep(step, index),
      onStateChange: (state) => this.setData({ playerState: state, playing: state === 'PLAYING' }),
      onFinish: () => this.setData({ playing: false })
    });

    // 显示复杂度
    const tc = meta.timeComplexity;
    const tcStr = typeof tc === 'object'
      ? `最好${tc.best} 平均${tc.average} 最坏${tc.worst}`
      : String(tc || '-');

    this.setData({
      loading: false,
      algorithmName: meta.name,
      difficulty: meta.difficulty,
      difficultyName: DIFFICULTY_NAMES[meta.difficulty] || meta.difficulty,
      timeComplexity: tcStr,
      spaceComplexity: meta.spaceComplexity || '-',
      problemDescription: meta.description,
      codeLines: code,
      totalSteps: allSteps.length,

      // 初始步骤
      stepIndex: 0,
      stepDescription: allSteps[0].description || '',
      variables: allSteps[0].variables || {},
      highlightedLines: allSteps[0].highlights ? allSteps[0].highlights.codeLines || [] : [],
    });

    // 如果 canvas 已就绪，立即渲染第一步
    if (this._canvasReady) {
      this._renderer.render(allSteps[0].data, allSteps[0].highlights || {});
    }
  },

  _createRenderer(type, width, height) {
    switch (type) {
      case 'array':      return new BarChartRenderer('algo-canvas', width, height);
      case 'matrix':     return new MatrixRenderer('algo-canvas', width, height);
      case 'linkedlist': return new LinkedListRenderer('algo-canvas', width, height);
      case 'tree':       return new TreeRenderer('algo-canvas', width, height);
      case 'graph':      return new GraphRenderer('algo-canvas', width, height);
      default:
        console.warn('不支持的渲染类型: ' + type + '，使用 BarChartRenderer');
        return new BarChartRenderer('algo-canvas', width, height);
    }
  },

  _initCanvas() {
    if (!this._renderer) return;
    this._renderer.init()
      .then(() => {
        this._canvasReady = true;
        // 渲染当前步骤
        if (this._player) {
          const step = this._player._history[0];
          if (step) {
            this._renderer.render(step.data, step.highlights || {});
          }
        }
      })
      .catch((err) => {
        console.error('Canvas 初始化失败', err);
      });
  },

  // ─── 步骤回调 ──────────────────────────────────────────────

  _onStep(step, index) {
    this.setData({
      stepIndex: index,
      stepDescription: step.description || '',
      variables: step.variables || {},
      highlightedLines: step.highlights ? (step.highlights.codeLines || []) : []
    });

    if (this._renderer && step.data) {
      this._renderer.render(step.data, step.highlights || {});
    }
  },

  // ─── 控制栏事件 ────────────────────────────────────────────

  onPlay()       { if (this._player) this._player.play(); },
  onPause()      { if (this._player) this._player.pause(); },
  onNext()       { if (this._player) this._player.next(); },
  onPrev()       { if (this._player) this._player.prev(); },
  onJumpToStart(){ if (this._player) this._player.jumpToStart(); },
  onJumpToEnd()  { if (this._player) this._player.jumpToEnd(); },

  onSpeedChange(e) {
    const speed = e.detail.speed;
    this.setData({ speed });
    if (this._player) this._player.setSpeed(speed);
  },

  // ─── 描述展开 ──────────────────────────────────────────────

  onToggleDesc() {
    this.setData({ descExpanded: !this.data.descExpanded });
  },

  // ─── 重试 ──────────────────────────────────────────────────

  onRetry() {
    this.setData({ error: '', loading: true });
    this._loadAlgorithm();
  }
});
