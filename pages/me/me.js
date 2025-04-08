// pages/me/me.js
Page({
  data: {
    activeTab: 'POSTS',
    avatarUrl: "",  // 替换成动态的头像
    nickName: "",  // 替换成动态的昵称
    cards: [
      { content: 'Card content 1' },
      { content: 'Card content 2' },
      { content: 'Card content 3' }
    ]
  },
  onLoad(){
    this.setData({
      avatarUrl:wx.getStorageSync('userinfo').avatar,
      name: wx.getStorageSync('userinfo').name
    });
  }
});
