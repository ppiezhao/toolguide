/**
 * list - 算法列表页面
 *
 * 支持分类切换、难度筛选、搜索过滤。
 * 点击卡片导航到 playground 播放页。
 */

const categories = require('../../../config/categories.js');

// 静态 require（打包器需要静态路径才能正确编译）
const sortingModules    = require('../../../subpkg/sorting/index');
const searchingModules  = require('../../../subpkg/searching/index');
const linkedlistModules = require('../../../subpkg/linkedlist/index');
const treeModules       = require('../../../subpkg/tree/index');
const graphModules      = require('../../../subpkg/graph/index');
const dpModules         = require('../../../subpkg/dp/index');
const arrayHashModules  = require('../../../subpkg/array-hash/index');

const LOADED_CATEGORIES = {
  sorting:    sortingModules,
  searching:  searchingModules,
  linkedlist: linkedlistModules,
  tree:       treeModules,
  graph:      graphModules,
  dp:         dpModules,
  'array-hash': arrayHashModules
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
    allAlgorithms: [],
    filteredAlgorithms: [],
    loading: true,
    error: '',
    loadedCategories: LOADED_CATEGORIES
  },

  onLoad() {
    this._filterAndRender();
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
      loading: false,
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
    this.setData({ error: '', loading: true });
    this._filterAndRender();
  }
});
