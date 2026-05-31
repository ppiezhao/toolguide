/**
 * control-bar 组件 - 算法播放控制栏
 *
 * 属性:
 *   playing     - Boolean 是否正在播放
 *   speed       - Number  当前速度 (ms)
 *   stepIndex   - Number  当前步骤索引
 *   totalSteps  - Number  总步骤数
 *   playerState - String  播放器状态 (IDLE|PLAYING|PAUSED|FINISHED)
 *
 * 事件:
 *   play, pause, next, prev, jumpToStart, jumpToEnd, speedChange
 */
Component({
  properties: {
    playing: { type: Boolean, value: false },
    speed: { type: Number, value: 500 },
    stepIndex: { type: Number, value: 0 },
    totalSteps: { type: Number, value: 0 },
    playerState: { type: String, value: 'IDLE' }
  },

  data: {
    speedOptions: [
      { value: 200, label: '5x' },
      { value: 400, label: '2.5x' },
      { value: 800, label: '1.25x' },
      { value: 1500, label: '0.67x' },
      { value: 3000, label: '0.33x' }
    ]
  },

  methods: {
    onTogglePlay() {
      if (this.data.playing) {
        this.triggerEvent('pause');
      } else {
        this.triggerEvent('play');
      }
    },

    onNext() {
      this.triggerEvent('next');
    },

    onPrev() {
      this.triggerEvent('prev');
    },

    onJumpToStart() {
      this.triggerEvent('jumpToStart');
    },

    onJumpToEnd() {
      this.triggerEvent('jumpToEnd');
    },

    onSpeedChange(e) {
      const speed = Number(e.currentTarget.dataset.speed);
      this.triggerEvent('speedChange', { speed });
    }
  }
});
