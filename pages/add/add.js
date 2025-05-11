// pages/add/add.js
Page({
  data: {
    title: '',
    description: '',
    location: '',
    images: [],
    tags: ['shopping', 'spot', 'food'],
    selectedTag: '',
  },

  onTitleChange(e) {
    this.setData({ title: e.detail.value });
  },
  onDescriptionChange(e) {
    this.setData({ description: e.detail.value });
  },
  onLocationChange(e) {
    this.setData({ location: e.detail.value });
  },
  onTagChange(e) {
    const index = e.detail.value;
    this.setData({ selectedTag: this.data.tags[index] });
  },

  uploadImage() {
    wx.chooseMedia({
      count: 9 - this.data.images.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const newImgs = res.tempFiles.map(file => file.tempFilePath);
        this.setData({ images: [...this.data.images, ...newImgs] });
      }
    });
  },

  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.images
    });
  },

  removeImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({ images });
  },

  // 提交帖子
  submitPost() {
    const { title, description, location, images, selectedTag } = this.data;
    
    if (!title || !description || !location || images.length === 0 || !selectedTag) {
      wx.showToast({
        title: 'Please fill in all fields!',
        icon: 'none',
      });
      return;
    }

    // 假设用户 ID 保存在 storage 中
    const createdBy = wx.getStorageSync('userinfo')._id;

    // 发送数据到后端
    wx.request({
      url: `${wx.getStorageSync('apiBaseUrl')}/api/postNewPlan`,  // 后端接口
      method: 'POST',
      data: {
        title,
        describe: description,
        location,
        images,
        tag: [selectedTag],  // 标签是数组
        createdBy,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: 'Post created successfully!',
            icon: 'success',
          });
          // 跳转到帖子详情页或其他页面
          wx.redirectTo({
            url: '/pages/post/post'
          });          
        } else {
          wx.showToast({
            title: 'Failed to create post',
            icon: 'none',
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: 'Network error',
          icon: 'none',
        });
      },
    });
  },
});
