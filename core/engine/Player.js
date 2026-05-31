/**
 * Player - 步骤播放控制器
 *
 * 控制算法步骤的自动播放和手动步进。
 * 使用 generator + history 数组模式，支持前进/后退/调速。
 *
 * 状态机：IDLE -> PLAYING <-> PAUSED -> FINISHED
 *
 * @example
 *   const player = new Player({
 *     generator: algorithmModule.steps(inputData),
 *     onStep: (step, index, total) => page.onStep(step, index, total),
 *     onStateChange: (state) => page.setData({ playerState: state }),
 *     onFinish: () => page.onFinish()
 *   });
 *   player.play();
 */
class Player {
  /**
   * @param {Object} options
   * @param {Generator} options.generator - 步骤生成器
   * @param {Function} options.onStep    - 回调(step, index, total)
   * @param {Function} [options.onStateChange] - 状态变化回调(state)
   * @param {Function} [options.onFinish]      - 完成回调
   */
  constructor({ generator, onStep, onStateChange, onFinish }) {
    this._generator = generator;
    this._onStep = onStep || (() => {});
    this._onStateChange = onStateChange || (() => {});
    this._onFinish = onFinish || (() => {});

    this._timerId = null;
    this._speed = 500;          // ms per step
    this._stepIndex = 0;
    this._history = [];         // all yielded steps, for prev() support
    this._state = 'IDLE';       // IDLE | PLAYING | PAUSED | FINISHED
    this._totalSteps = null;    // set after pre-run
  }

  get state() { return this._state; }
  get stepIndex() { return this._stepIndex; }
  get totalSteps() { return this._totalSteps; }
  get speed() { return this._speed; }

  // ─── Public API ────────────────────────────────────────────

  /** 开始 / 恢复自动播放 */
  play() {
    if (this._state === 'FINISHED') return;
    if (this._state === 'IDLE' && this._history.length === 0) {
      this._stepTo(0);  // render step 0 first
    }
    this._setState('PLAYING');
    this._tick();
  }

  /** 暂停 */
  pause() {
    if (this._state !== 'PLAYING') return;
    this._clearTimer();
    this._setState('PAUSED');
  }

  /** 切换播放/暂停 */
  toggle() {
    if (this._state === 'PLAYING') this.pause();
    else this.play();
  }

  /** 手动前进一步 */
  next() {
    if (this._state === 'FINISHED') return;
    this._advance();
  }

  /** 手动后退一步 */
  prev() {
    if (this._stepIndex <= 0) return;
    this._stepIndex--;
    const step = this._history[this._stepIndex];
    this._onStep(step, this._stepIndex, this._totalSteps);
  }

  /** 设置播放速度 (ms/step) */
  setSpeed(ms) {
    this._speed = ms;
  }

  /** 重置到初始状态 */
  reset() {
    this._clearTimer();
    this._setState('IDLE');
    this._stepIndex = 0;
    this._history = [];
  }

  /** 跳到指定步骤 */
  jumpTo(index) {
    if (index < 0 || index >= this._totalSteps) return;
    if (index < this._history.length) {
      this._stepIndex = index;
      this._onStep(this._history[index], index, this._totalSteps);
      return;
    }
    // forward to index
    while (this._stepIndex <= index) {
      const result = this._generator.next();
      if (result.done) {
        this._setState('FINISHED');
        this._onFinish();
        return;
      }
      result.value.id = this._stepIndex;
      this._history.push(result.value);
      if (this._stepIndex === index) {
        this._onStep(result.value, this._stepIndex, this._totalSteps);
      }
      this._stepIndex++;
    }
  }

  /** 跳到开始 */
  jumpToStart() {
    this.jumpTo(0);
  }

  /** 跳到末尾 */
  jumpToEnd() {
    if (this._totalSteps === null) return;
    this.jumpTo(this._totalSteps - 1);
  }

  /** 销毁，清理定时器 */
  destroy() {
    this._clearTimer();
    this._generator = null;
    this._history = [];
  }

  // ─── Private ───────────────────────────────────────────────

  _tick() {
    if (this._state !== 'PLAYING') return;
    this._advance();
    if (this._state === 'PLAYING') {
      this._timerId = setTimeout(() => this._tick(), this._speed);
    }
  }

  _advance() {
    const result = this._generator.next();
    if (result.done) {
      this._setState('FINISHED');
      this._onFinish();
      return;
    }
    result.value.id = this._stepIndex;
    this._history.push(result.value);
    this._onStep(result.value, this._stepIndex, this._totalSteps);
    this._stepIndex++;
  }

  _stepTo(index) {
    this._stepIndex = index;
    if (this._history.length > index) {
      this._onStep(this._history[index], index, this._totalSteps);
    }
  }

  _setState(state) {
    this._state = state;
    this._onStateChange(state);
  }

  _clearTimer() {
    if (this._timerId !== null) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
  }
}

module.exports = Player;
