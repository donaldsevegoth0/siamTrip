// pages/me/me.js
Page({
  data: {
    avatarUrl: "",  // 替换成动态的头像
    nickName: "",  // 替换成动态的昵称
    posts: [
    ],
    activeTab: 'posts'
  },
  onLoad(){
    this.setData({
      avatarUrl:wx.getStorageSync('userinfo').avatar,
      name: wx.getStorageSync('userinfo').name
    });
    this.fetchUserPosts();
  },

  onShow(){
    console.log('onShow triggered'); // for debug
    this.fetchUserCollectedPosts();
    this.fetchUserPosts()
  },

  fetchUserPosts() {
    const userId = wx.getStorageSync('userinfo')._id; // 获取当前用户的ID

    // 发送请求到后端，获取当前用户的所有帖子
    wx.request({
      url: `${wx.getStorageSync('apiBaseUrl')}/api/userPosts`,  // 后端接口地址
      method: 'GET',
      data: {
        userId: userId,  // 将 userId 作为请求数据发送
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 更新页面数据
          this.setData({
            posts: res.data,  // 返回的帖子数据
          });
        } else {
          wx.showToast({
            title: 'Failed to load posts',
            icon: 'none',
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: 'Network error',
          icon: 'none',
        });
      }
    });
  },
  switchToPosts() {
    this.setData({ activeTab: 'posts' });
    this.fetchUserPosts();
  },

  switchToCollect() {
    this.setData({ activeTab: 'collect' });
    this.fetchUserCollectedPosts();
  },
  fetchUserCollectedPosts(){
    const userId = wx.getStorageSync('userinfo')._id; // 假设你登录时存了用户ID

    wx.request({
  url: `${wx.getStorageSync('apiBaseUrl')}/api/${userId}/collections`,
  method: 'GET',
  success: (res) => {
    if (res.statusCode === 200) {
      this.setData({
        posts: res.data
      });
    } else {
      wx.showToast({ title: '获取收藏失败', icon: 'none' });
    }
  },
  fail: () => {
    wx.showToast({ title: '网络错误', icon: 'none' });
  }
    });

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
  }
});
