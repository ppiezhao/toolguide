/**
 * list - 算法列表页面
 *
 * 支持分类切换、难度筛选、搜索过滤。
 * 点击卡片导航到 playground 播放页。
 */

const categories = require('../../../config/categories.js');

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

Page({
  data: {
    categories,
    currentCategory: 'all',
    currentDifficulty: 'all',
    difficultyFilters: [
      { value: 'all', label: '全部难度' },
      { value: 'easy', label: '简单' },
      { value: 'medium', label: '中等' },
      { value: 'hard', label: '困难' }
    ],
    searchText: '',
    allAlgorithms: [],       // 所有已加载的算法模块
    filteredAlgorithms: [],  // 过滤后的结果
    loading: true,
    error: '',
    loadedCategories: {}    // 已加载的分类缓存
  },

  onLoad() {
    // 加载全部算法
    this._loadAllAlgorithms();
  },

  // ─── 加载全部算法 ──────────────────────────────────────────

  _loadAllAlgorithms() {
    this.setData({ loading: true, error: '' });
    const loadedCategories = {};

    try {
      for (const cat in SUBPKG_MAP) {
        const modules = require(SUBPKG_MAP[cat]);
        loadedCategories[cat] = modules;
      }
      this.setData({ loadedCategories, loading: false });
      this._filterAndRender();
    } catch (e) {
      console.error('加载算法失败', e);
      this.setData({ error: '加载失败: ' + e.message, loading: false });
    }
  },

  // ─── 分类切换 ──────────────────────────────────────────────

  onSwitchCategory(e) {
    const category = e.currentTarget.dataset.category;
    if (category === this.data.currentCategory) return;
    this.setData({ currentCategory: category, searchText: '' });
    this._filterAndRender();
  },

  // ─── 难度筛选 ──────────────────────────────────────────────

  onSwitchDifficulty(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    this.setData({ currentDifficulty: difficulty });
    this._filterAndRender();
  },

  // ─── 搜索 ──────────────────────────────────────────────────

  onSearchInput(e) {
    this.setData({ searchText: e.detail.value });
    this._filterAndRender();
  },

  onClearSearch() {
    this.setData({ searchText: '' });
    this._filterAndRender();
  },

  // ─── 过滤与渲染 ────────────────────────────────────────────

  _filterAndRender() {
    const { currentCategory, currentDifficulty, searchText, loadedCategories } = this.data;

    // 收集算法
    let allAlgos = [];
    if (currentCategory === 'all') {
      for (const cat in loadedCategories) {
        allAlgos = allAlgos.concat(loadedCategories[cat]);
      }
    } else {
      allAlgos = loadedCategories[currentCategory] || [];
    }

    // 过滤
    let filtered = allAlgos;
    if (currentDifficulty !== 'all') {
      filtered = filtered.filter(m => m.meta.difficulty === currentDifficulty);
    }
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      filtered = filtered.filter(m =>
        m.meta.name.toLowerCase().includes(q) ||
        (m.meta.nameEn && m.meta.nameEn.toLowerCase().includes(q)) ||
        (m.meta.tags && m.meta.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // 计算复杂度字符串
    filtered = filtered.map(m => {
      const tc = m.meta.timeComplexity;
      const tcStr = typeof tc === 'object'
        ? `最好${tc.best} 平均${tc.average} 最坏${tc.worst}`
        : String(tc || '-');
      return Object.assign({}, m, { complexityStr: tcStr });
    });

    this.setData({
      allAlgorithms: allAlgos,
      filteredAlgorithms: filtered
    });
  },

  // ─── 点击卡片 ──────────────────────────────────────────────

  onTapCard(e) {
    const { id, category } = e.detail;
    wx.navigateTo({
      url: `/pages/algorithm/playground/playground?id=${id}&category=${category}`
    });
  },

  // ─── 重试 ──────────────────────────────────────────────────

  onRetry() {
    this._loadAllAlgorithms();
  }
});
