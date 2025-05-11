// app.js
App({
  onLaunch() {
    wx.setStorageSync('apiBaseUrl', 'https://siamtripbackend.onrender.com');
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

