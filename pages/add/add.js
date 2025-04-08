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

  submitPost() {
    const { title, description, location, images, selectedTag } = this.data;
    if (!title || !description || !location || !selectedTag || images.length === 0) {
      wx.showToast({ title: 'Please fill in all fields', icon: 'none' });
      return;
    }

    const userinfo = wx.getStorageSync('userinfo');
    const postData = { title, description, location, image: images, tag: selectedTag };

    wx.request({
      url: 'https://your.api/create-post',
      method: 'POST',
      data: postData,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userinfo.token
      },
      success: () => {
        wx.showToast({ title: 'Post created!' });
        wx.navigateBack();
      },
      fail: err => {
        wx.showToast({ title: 'Failed to post', icon: 'error' });
        console.error(err);
      }
    });
  }
});
