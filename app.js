// app.js
App({
  onLaunch() {
    wx.setStorageSync('apiBaseUrl', 'http://localhost:3000');
    wx.login({
      success: res => {
        wx.setStorageSync('wxCode', res.code); // 暂存 code，等用户授权头像昵称后再一起发
      }
    });
  },
  
  globalData: {
    tabBar: null
  },
});

