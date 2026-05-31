/**
 * problem-card 组件 - 算法卡片
 *
 * 属性: index, id, name, difficulty, difficultyName, timeComplexity,
 *       spaceComplexity, stable, tags, category
 * 事件: tap -> { id, category }
 */

const DIFFICULTY_NAMES = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
};

Component({
  properties: {
    index:    { type: Number, value: 0 },
    id:       { type: String, value: '' },
    name:     { type: String, value: '' },
    difficulty: { type: String, value: 'easy' },
    timeComplexity: { type: String, value: '-' },
    spaceComplexity: { type: String, value: '-' },
    stable:   { type: Boolean, value: null },
    tags:     { type: Array, value: [] },
    category: { type: String, value: '' }
  },

  data: {
    indexStr: '',
    difficultyName: ''
  },

  observers: {
    'index, difficulty': function (index, difficulty) {
      this.setData({
        indexStr: String(index + 1).padStart(2, '0'),
        difficultyName: DIFFICULTY_NAMES[difficulty] || difficulty
      });
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', {
        id: this.data.id,
        category: this.data.category
      });
    }
  }
});
