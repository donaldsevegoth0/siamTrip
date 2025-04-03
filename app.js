// app.js
App({
  onLaunch() {
    //https://siamtripbackend.onrender.com
    wx.setStorageSync('apiBaseUrl', "localhost:3000");
    const token = wx.getStorageSync('token'); // 读取本地存储的 token
    if (token) {
      // 如果有 token，直接跳转到首页
      wx.reLaunch({
        url: '/pages/home/home'
      });
    } else {
      // 没有 token，则请求后端检查微信登录
      this.checkLoginStatus();
    }
  },
  checkLoginStatus() {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: `${wx.getStorageSync('apiBaseUrl')}/api/checkLogin',
            method: 'POST`,
            data: { code: res.code },
            success: (result) => {
              if (result.data.loggedIn) {
                wx.setStorageSync('token', result.data.token);
                wx.reLaunch({ url: '/pages/home/home' }); // 登录成功，跳转到首页
              } else {
                wx.reLaunch({ url: '/pages/login/login' }); // 未登录，跳转到授权登录页
              }
            }
          });
        } else {
          console.log('微信登录失败', res.errMsg);
        }
      }
    });
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

