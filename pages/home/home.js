// pages/index/index.js
import checkLogin from '../../utils/checkLogin';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts:[],
    searchQuery: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: `${wx.getStorageSync('apiBaseUrl')}/api/recommended`,  // 后端的接口地址
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            posts: res.data,
          });
          console.log(res.data);
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none',
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '请求失败，请检查网络连接',
          icon: 'none',
        });
      }
    });
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
    if (!checkLogin()) return;
    // 已登录，正常执行页面逻辑
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 }); // Highlight "Home"
    }
    this.fetchPostDetails;
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

  goAssist:function(){
    wx.switchTab({
      url: '/pages/talk/talk'
    })
  },
  goPost:function(){
    wx.switchTab({
      url: '/pages/post/post'
    })
  },
  goToDetail(e) {
    const postId = e.currentTarget.dataset.id;
    const post = this.data.posts.find(item => item._id === postId);  // 使用 MongoDB 的 _id

    // 将帖子数据序列化成字符串
    const postStr = encodeURIComponent(JSON.stringify(post));
  
    // 跳转并传参
    wx.navigateTo({
      url: `/pages/post/postDetail?post=${postStr}`
    });
  },
  onInput(e){
    const query = e.detail.value;
    this.setData({
      searchQuery: query,
    });
    wx.setStorageSync('query', this.data.searchQuery);
  },
  onSearch(){
    wx.switchTab({
      url: "../post/post",
    })
  }
})