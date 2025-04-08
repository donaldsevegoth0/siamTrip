Page({
  data: {
    post: null,
    hasLiked: false // 控制点赞只加一次
  },

  onLoad(options) {
    if (options.post) {
      const post = JSON.parse(decodeURIComponent(options.post));
      this.setData({
        post
      });
    }
  },

  // 返回按钮
  goBack() {
    wx.navigateBack();
  },

  // 点赞交互
  handleLike() {
    if (this.data.hasLiked) {
      wx.showToast({
        title: '你已经点过赞啦~',
        icon: 'none'
      });
      return;
    }
  
    const post = this.data.post;
    post.likes += 1; // 点赞数+1
  
    this.setData({
      post,
      hasLiked: true
    });
  
    wx.showToast({
      title: '点赞成功 ❤️',
      icon: 'success'
    });
  },
  

  // 分享交互
  handleShare() {
    wx.showToast({
      title: '已分享给好友 🔁',
      icon: 'success'
    });
  },

  // 实际分享功能
  onShareAppMessage() {
    const post = this.data.post;
    return {
      title: post.title,
      imageUrl: post.images?.[0] || '', // 分享第一张图片
      path: `/pages/post-detail/post-detail?post=${encodeURIComponent(JSON.stringify(post))}`
    };
  }
  
});
