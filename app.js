// app.js
App({
  globalData: {
    appData: [
      {
        id: 'deepseek',
        name: 'DeepSeek',
        icon: 'https://p6-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/29ffedd12452471d93577f5786512d67~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751191&x-signature=Q49j%2B2EPu87dHkkoRHftDkjAQJg%3D',
        category: 'tools',
        categoryName: '工具服务',
        rating: 4.9,
        url: 'https://chat.deepseek.com'
      },
      {
        id: 'checkin',
        name: '每日打卡',
        icon: 'https://p6-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/29ffedd12452471d93577f5786512d67~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751191&x-signature=Q49j%2B2EPu87dHkkoRHftDkjAQJg%3D',
        category: 'tools',
        categoryName: '工具服务',
        rating: 4.9,
        url: 'pages/calendar/calendar'
      },
      {
        id: 'algorithm',
        name: '算法可视化',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIyMCIgZmlsbD0iIzA3QzE2MCIvPjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1zaXplPSI0MCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPmYoeCk8L3RleHQ+PC9zdmc+',
        category: 'education',
        categoryName: '教育学习',
        rating: 5.0,
        url: 'pages/algorithm/list/list'
      },
      {
        id: '1',
        name: '美团外卖',
        icon: 'https://p11-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/ee3da03d92864d84bb532b414977e037~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751189&x-signature=74ZplB5C1K3EsJYPmnDmu5fY53E%3D',
        category: 'food',
        categoryName: '外卖美食',
        rating: 4.8,
        url: 'weixin://wx2c462b6b35599968/pages/login/login'
      }
    ],
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
