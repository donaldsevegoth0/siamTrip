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
  handleLogin() {
    const apiBaseUrl = wx.getStorageSync('apiBaseUrl');
    
    // 先调用 wx.getUserProfile 获取用户授权信息
    wx.getUserProfile({
      desc: '用于登录/注册', // 授权描述
      success: (profileRes) => {
        const { avatarUrl, nickName } = profileRes.userInfo;
  
        // 用户授权后，调用 wx.login 获取临时登录凭证
        wx.login({
          success(res) {
            if (res.code) {
              // 调用后端登录接口
              wx.request({
                url: `${apiBaseUrl}/api/login`,
                method: 'POST',
                data: {
                  code: res.code, // 获取到的临时登录凭证
                  avatarUrl,
                  nickName
                },
                success: (res) => {
                  const { name, avatar, token } = res.data.data;
                  console.log(name);
                  wx.setStorageSync('userinfo', { name: name, avatar:avatar, token:token }); // 保存 JWT
  
                  // 提示登录成功
                  wx.showToast({ title: '登录成功' });
  
                  // 登录成功后跳转到首页
                  wx.reLaunch({
                    url: '/pages/home/home' // 替换为你的首页路径
                  });
                },
                fail: (err) => {
                  wx.showToast({ title: '登录失败', icon: 'none' });
                }
              });
            }
          },
          fail: (err) => {
            wx.showToast({ title: '登录失败', icon: 'none' });
          }
        });
      },
      fail: (err) => {
        wx.showToast({ title: '授权失败', icon: 'none' });
        console.error('授权失败', err);
      }
    });
  }
  
  
})