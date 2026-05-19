// pages/calendar/calendar.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentDateStr: '',
    calendarTitle: '',
    calendarDays: [],
    currentMonth: null,
    currentYear: null,
    selectedDate: null,
    selectedDateStr: '',
    hasContent: false,
    contentItems: [],
    showModal: false,
    selectedColor: 'black',
    editText: '',
    editIndex: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initCalendar()
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
    // 重新加载数据
    const app = getApp()
    this.setData({
      checkInData: app.globalData.checkInData
    })
    this.renderCalendar()
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
    this.onShow()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 初始化日历
  initCalendar() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    this.setData({
      currentYear: year,
      currentMonth: month,
      currentDateStr: this.formatDateStr(now),
      selectedDate: this.formatDateStr(now),
      selectedDateStr: this.formatDateStr(now)
    })

    this.renderCalendar()
  },

  // 渲染日历
  renderCalendar() {
    const { currentYear, currentMonth } = this.data

    // 计算当月第一天是星期几
    const firstDay = new Date(currentYear, currentMonth, 1)
    const firstDayOfWeek = firstDay.getDay()

    // 计算当月有多少天
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    // 获取打卡数据
    const { checkInData } = this.data
    const today = this.formatDateStr(new Date())

    // 生成日历格子
    const calendarDays = []
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']

    // 填充上个月的剩余天数
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        day: prevMonthDays - i,
        fullDate: this.formatDate(currentYear, currentMonth - 1, prevMonthDays - i),
        hasCheckIn: checkInData[this.formatDate(currentYear, currentMonth - 1, prevMonthDays - i)] ? true : false,
        today: this.formatDate(currentYear, currentMonth - 1, prevMonthDays - i) === today
      })
    }

    // 填充当月天数
    for (let i = 1; i <= daysInMonth; i++) {
      const fullDate = this.formatDate(currentYear, currentMonth, i)
      calendarDays.push({
        day: i,
        fullDate: fullDate,
        hasCheckIn: checkInData[fullDate] ? true : false,
        today: fullDate === today
      })
    }

    // 填充下个月的开始天数，使格子数量为42个（6行）
    const totalDays = firstDayOfWeek + daysInMonth
    const nextMonthDays = 42 - totalDays
    for (let i = 1; i <= nextMonthDays; i++) {
      calendarDays.push({
        day: i,
        fullDate: this.formatDate(currentYear, currentMonth + 1, i),
        hasCheckIn: false,
        today: false
      })
    }

    // 更新标题
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    this.setData({
      calendarDays,
      calendarTitle: `${currentYear}年${monthNames[currentMonth]}`
    })

    // 如果有选中的日期，加载该日期的内容
    if (this.data.selectedDate) {
      this.loadDateContent(this.data.selectedDate)
    }
  },

  // 格式化日期为字符串
  formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  },

  // 格式化日期显示
  formatDateStr(date) {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return `${month}月${day}日 ${weekdays[date.getDay()]}`
  },

  // 选择日期
  selectDay(e) {
    const fullDate = e.currentTarget.dataset.date
    this.setData({
      selectedDate: fullDate,
      selectedDateStr: this.formatDateStr(new Date(fullDate))
    })
    this.loadDateContent(fullDate)
  },

  // 加载日期内容
  loadDateContent(fullDate) {
    const { checkInData } = this.data
    const content = checkInData[fullDate] || []

    this.setData({
      hasContent: content.length > 0,
      contentItems: content
    })
  },

  // 上个月
  prevMonth() {
    const { currentYear, currentMonth } = this.data
    let newYear = currentYear
    let newMonth = currentMonth - 1

    if (newMonth < 0) {
      newMonth = 11
      newYear = currentYear - 1
    }

    this.setData({
      currentYear: newYear,
      currentMonth: newMonth
    })
    this.renderCalendar()
  },

  // 下个月
  nextMonth() {
    const { currentYear, currentMonth } = this.data
    let newYear = currentYear
    let newMonth = currentMonth + 1

    if (newMonth > 11) {
      newMonth = 0
      newYear = currentYear + 1
    }

    this.setData({
      currentYear: newYear,
      currentMonth: newMonth
    })
    this.renderCalendar()
  },

  // 显示编辑模态框
  showEditModal() {
    const { selectedDate } = this.data

    this.setData({
      showModal: true,
      selectedColor: 'black',
      editText: '',
      editIndex: -1
    })
  },

  // 选择颜色
  selectColor(e) {
    const color = e.currentTarget.dataset.color
    this.setData({
      selectedColor: color
    })
  },

  // 编辑文本变化
  onEditTextChange(e) {
    this.setData({
      editText: e.detail.value
    })
  },

  // 取消编辑
  cancelEdit() {
    this.setData({
      showModal: false,
      editText: ''
    })
  },

  // 保存编辑
  saveEdit() {
    const { editText, selectedDate, selectedColor, editIndex } = this.data

    if (!editText.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }

    const { checkInData } = this.data
    const dateKey = selectedDate

    if (!checkInData[dateKey]) {
      checkInData[dateKey] = []
    }

    const content = {
      text: editText,
      color: selectedColor
    }

    if (editIndex >= 0) {
      // 更新现有记录
      checkInData[dateKey][editIndex] = content
    } else {
      // 添加新记录
      checkInData[dateKey].push(content)
    }

    // 保存到本地
    const app = getApp()
    app.globalData.checkInData = checkInData
    app.saveCheckInData()

    // 刷新内容显示
    this.loadDateContent(dateKey)

    // 关闭模态框
    this.setData({
      showModal: false,
      editText: ''
    })

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })

    // 刷新日历
    this.renderCalendar()
  },

  // 关闭模态框
  closeModal() {
    this.setData({
      showModal: false
    })
  },

  // 阻止事件冒泡
  stopPropagation() {
  },

  // 截图保存
  takeScreenshot() {
    wx.showLoading({
      title: '正在保存...'
    })

    // 使用小程序截图API
    try {
      wx.canvasToTempFilePath({
        canvasId: 'screenshot-canvas',
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.hideLoading()
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              })
            },
            fail: (err) => {
              wx.hideLoading()
              console.error('保存失败', err)
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        },
        fail: (err) => {
          wx.hideLoading()
          console.error('截图失败', err)
          wx.showToast({
            title: '截图失败',
            icon: 'none'
          })
        }
      })
    } catch (e) {
      wx.hideLoading()
      wx.showToast({
        title: '功能暂不支持',
        icon: 'none'
      })
    }
  }
})
