// app.js
App({
  globalData: {
    checkInData: {}
  },

  onLoad() {
    this.loadCheckInData()
  },

  loadCheckInData() {
    try {
      const data = wx.getStorageSync('checkInData')
      if (data) {
        this.globalData.checkInData = data
      }
    } catch (e) {
      console.error('加载打卡数据失败', e)
    }
  },

  saveCheckInData() {
    try {
      wx.setStorageSync('checkInData', this.globalData.checkInData)
    } catch (e) {
      console.error('保存打卡数据失败', e)
    }
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  }
})
