// app.js
App({
  onLaunch() {
    
  },
  
  globalData: {
    tabBar: null
  },
  onPullDownRefresh() {
    console.log("全局下拉刷新触发");

    // 获取当前页面
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1]; // 获取当前页面实例

    if (currentPage) {
      let url = "/" + currentPage.route; // 获取当前页面的路径
      console.log("正在重新加载:", url);

      // 重新加载当前页面，触发 onLoad
      wx.reLaunch({
        url: url,
        success() {
          console.log("页面重新加载成功");
        },
        fail(err) {
          console.error("页面重新加载失败:", err);
        },
        complete() {
          // 停止刷新动画
          wx.stopPullDownRefresh();
        }
      });
    }
  }
});

