// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentCategory: 'all',
    appCount: 8,
    loadCount: 4,
    showLoadMore: true,
    loading: false,
    filteredApps: [],
    bannerDots: [true, false, false]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.renderApps()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      currentCategory: 'all',
      appCount: 8
    })
    this.renderApps()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.showLoadMore && !this.data.loading) {
      this.loadMore()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 切换分类
  switchCategory(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      currentCategory: value,
      appCount: 8
    })
    this.renderApps()
  },

  // 渲染小程序列表
  renderApps() {
    const { currentCategory, appCount } = this.data
    const { appData } = getApp().globalData

    let filteredApps = appData
    if (currentCategory !== 'all') {
      filteredApps = appData.filter(app => app.category === currentCategory)
    }

    const displayApps = filteredApps.slice(0, appCount)
    this.setData({
      filteredApps: displayApps,
      showLoadMore: displayApps.length < filteredApps.length
    })
  },

  // 打开小程序
  openApp(e) {
    const { app } = e.currentTarget.dataset
    wx.showToast({
      title: `即将打开 ${app.name}`,
      icon: 'none'
    })
  },

  // 加载更多
  loadMore() {
    if (this.data.loading) return

    this.setData({
      loading: true
    })

    setTimeout(() => {
      const { appCount, loadCount, filteredApps } = this.data
      const newCount = appCount + loadCount

      // 获取所有过滤后的应用
      let allApps = filteredApps
      if (this.data.currentCategory === 'all') {
        allApps = getApp().globalData.appData
      }

      const displayApps = allApps.slice(0, newCount)
      this.setData({
        appCount: newCount,
        filteredApps: displayApps,
        showLoadMore: displayApps.length < allApps.length,
        loading: false
      })
    }, 1000)
  }
})
