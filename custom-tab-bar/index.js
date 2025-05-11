Component({
  data: {
    selected: Number(wx.getStorageSync("selectedTab") || 0), // 从缓存读取选中状态
    list: [
      { text: "HOME", pagePath: "/pages/home/home" },
      { text: "POST", pagePath: "/pages/post/post" },
      { text: "+", pagePath: "/pages/add/add" },
      { text: "ASSIST", pagePath: "/pages/talk/talk" },
      { text: "ME", pagePath: "/pages/me/me" }
    ]
  },
  lifetimes: {
    attached() {
      // 初始化时读取 selected 状态
      this.setData({
        selected: wx.getStorageSync("selectedTab") || 0
      });
    }
  },
  pageLifetimes: {
    show() {
      // 每次页面显示时，更新 selected 数据
      const selectedTab = wx.getStorageSync("selectedTab") || 0;
      this.setData({
        selected: selectedTab
      });
    }
  },
  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const pagePath = this.data.list[index].pagePath;
  
      // **存储选中的 tab index**
      wx.setStorageSync("selectedTab", index);
  
      // 更新 selected 数据，触发页面重新渲染
      this.setData({
        selected: index
      });
  
      wx.switchTab({ url: pagePath });
    }
  }
});

