// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('进入授权页面');
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
  onLogin() {
    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        wx.login({
          success: (loginRes) => {
            wx.request({
              url: `${wx.getStorageSync('apiBaseUrl')}/api/login`,
              method: 'POST',
              data: {
                code: loginRes.code,
                userInfo: res.userInfo
              },
              success: (result) => {
                if (result.data.success) {
                  wx.setStorageSync('token', result.data.token);
                  wx.reLaunch({ url: '/pages/home/home' }); // 登录成功，跳转到首页
                } else {
                  wx.showToast({ title: '登录失败', icon: 'none' });
                }
              }
            });
          }
        });
      },
      fail: () => {
        wx.showToast({ title: '授权失败', icon: 'none' });
      }
    });
  }
})