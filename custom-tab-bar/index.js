Component({
  data: {
    selected: wx.getStorageSync("selectedTab") || 0, // 从缓存读取选中状态
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
      this.setData({ selected: wx.getStorageSync("selectedTab") || 0 });
    }
  },
  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const pagePath = this.data.list[index].pagePath;

      // **存储选中的 tab index**
      wx.setStorageSync("selectedTab", index);
        wx.switchTab({ url: pagePath });
      }
    }
});

