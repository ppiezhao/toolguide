// app.js
App({
  globalData: {
    userInfo: null,
    appData: [
      {
        id: '1',
        name: '美团外卖',
        description: '随时随地订餐，外卖美食送到家',
        icon: 'https://p11-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/ee3da03d92864d84bb532b414977e037~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751189&x-signature=74ZplB5C1K3EsJYPmnDmu5fY53E%3D',
        category: 'food',
        categoryName: '外卖美食',
        rating: 4.8,
        usageCount: 12580000
      },
      {
        id: '2',
        name: '滴滴出行',
        description: '打车、顺风车、专车，一站式出行服务',
        icon: 'https://p11-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/0bc7f437f6af44fd9c28ce4f46395df3~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751186&x-signature=cWiuBsGkrLhiKeIgOWBZ%2B0bNrG0%3D',
        category: 'travel',
        categoryName: '出行服务',
        rating: 4.6,
        usageCount: 9876000
      },
      {
        id: '3',
        name: '拼多多',
        description: '拼着买更便宜，百亿补贴，品质保障',
        icon: 'https://p6-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/80f195ab2b0849fcad8586e0ddc894bc~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751186&x-signature=REEJCsgL4As873Jx07Lgpllfc9Q%3D',
        category: 'shopping',
        categoryName: '购物电商',
        rating: 4.5,
        usageCount: 15678000
      },
      {
        id: '4',
        name: '腾讯视频',
        description: '热门电影、电视剧、综艺、动漫等你来看',
        icon: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/45a259aa744b472fa84c3266b6dea825~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751185&x-signature=HFzHgdmHp0z%2BDF7ka2A7FT2sygU%3D',
        category: 'entertainment',
        categoryName: '娱乐游戏',
        rating: 4.7,
        usageCount: 11234000
      },
      {
        id: '5',
        name: '微信读书',
        description: '海量正版书籍，随时随地阅读',
        icon: 'https://p6-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/29ffedd12452471d93577f5786512d67~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751191&x-signature=Q49j%2B2EPu87dHkkoRHftDkjAQJg%3D',
        category: 'education',
        categoryName: '教育学习',
        rating: 4.9,
        usageCount: 7890000
      },
      {
        id: '6',
        name: '微信支付',
        description: '安全便捷的支付方式，生活缴费、转账汇款',
        icon: 'https://p11-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/acc70185b8be4683a7a9332d725913a0~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751199&x-signature=h3e0r9ZB4N%2BcVGvMoESjr7bPMqA%3D',
        category: 'finance',
        categoryName: '金融理财',
        rating: 4.8,
        usageCount: 20123000
      },
      {
        id: '7',
        name: '生活缴费',
        description: '水电气费一键缴纳，方便快捷',
        icon: 'https://p11-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/acc70185b8be4683a7a9332d725913a0~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751199&x-signature=h3e0r9ZB4N%2BcVGvMoESjr7bPMqA%3D',
        category: 'life',
        categoryName: '生活服务',
        rating: 4.7,
        usageCount: 8765000
      },
      {
        id: '8',
        name: '腾讯健康',
        description: '在线问诊、体检报告解读、健康管理',
        icon: 'https://p11-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/acc70185b8be4683a7a9332d725913a0~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751199&x-signature=h3e0r9ZB4N%2BcVGvMoESjr7bPMqA%3D',
        category: 'health',
        categoryName: '健康医疗',
        rating: 4.6,
        usageCount: 6543000
      },
      {
        id: '9',
        name: '百度地图',
        description: '精准导航、实时路况、周边查询',
        icon: 'https://p11-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/0bc7f437f6af44fd9c28ce4f46395df3~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751186&x-signature=cWiuBsGkrLhiKeIgOWBZ%2B0bNrG0%3D',
        category: 'travel',
        categoryName: '出行服务',
        rating: 4.7,
        usageCount: 10234000
      },
      {
        id: '10',
        name: '京东',
        description: '正品低价、品质保障、快速配送',
        icon: 'https://p6-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/80f195ab2b0849fcad8586e0ddc894bc~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=20260519105140E093746C3B3B1B8D3D6D&rrcfp=f06b921b&x-expires=1781751186&x-signature=REEJCsgL4As873Jx07Lgpllfc9Q%3D',
        category: 'shopping',
        categoryName: '购物电商',
        rating: 4.6,
        usageCount: 12345000
      }
    ],
    categories: [
      { name: '全部', value: 'all' },
      { name: '外卖美食', value: 'food' },
      { name: '出行服务', value: 'travel' },
      { name: '购物电商', value: 'shopping' },
      { name: '娱乐游戏', value: 'entertainment' },
      { name: '实用工具', value: 'tools' },
      { name: '教育学习', value: 'education' },
      { name: '金融理财', value: 'finance' },
      { name: '生活服务', value: 'life' },
      { name: '健康医疗', value: 'health' }
    ]
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('login success', res.code)
      }
    })
  },

  globalData: {
    userInfo: null
  }
}
