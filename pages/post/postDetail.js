import checkLogin from '../../utils/checkLogin';
Page({
  data: {
    post: null,
    hasLiked: false,
    hasViewed: false,
    hasShared: false,
    favoritedCount: 0,
    updatedPost: null,
    isEditing: false,
    editedTitle: '',
    editedDescription: '',
    editedLocation: '',
    imageList: []
  },

  onLoad(options) {
    if (options.post) {
      const post = JSON.parse(decodeURIComponent(options.post));
      this.setData({
        post: post,
        favoritedCount: post.favoritedBy?.length || 0
      });
    }

    if (!this.data.hasViewed) {
      this.incrementViewCount(this.data.post._id);
    }
  },

  onShow(){
    if (!checkLogin()) return;
  },

  incrementViewCount(postId) {
    wx.request({
      url: `${wx.getStorageSync('apiBaseUrl')}/api/posts/${postId}/views`,
      method: 'PATCH',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            'post.views': res.data.views,
            hasViewed: true
          });
        }
      }
    });
  },

  handleLike() {
    if (this.data.hasLiked) {
      wx.showToast({ title: '你已经点过赞啦~', icon: 'none' });
      return;
    }

    const postId = this.data.post._id;
    wx.request({
      url: `${wx.getStorageSync('apiBaseUrl')}/api/${postId}/likes`,
      method: 'PATCH',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            post: res.data,
            hasLiked: true
          });
          wx.showToast({ title: '点赞成功 ❤️', icon: 'success' });
        }
      }
    });
  },

  handleFavorite() {
    const postId = this.data.post._id;
    const userId = wx.getStorageSync('userinfo')._id;

    wx.request({
      url: `${wx.getStorageSync('apiBaseUrl')}/api/${postId}/favorite`,
      method: 'PATCH',
      data: { userId },
      success: (res) => {
        const updated = res.data;
        this.setData({
          post: updated,
          favoritedCount: updated.favoritedBy?.length || 0
        });

        wx.showToast({
          title: updated.favoritedBy.includes(userId) ? '收藏成功 ⭐' : '取消收藏',
          icon: 'success'
        });
      }
    });
  },

  onShareAppMessage() {
    const post = this.data.post;
    return {
      title: post.title,
      imageUrl: post.images?.[0] || '',
      path: `/pages/post/postDetail?post=${encodeURIComponent(JSON.stringify(post))}`
    };
  },

  handleUpdate() {
    const { post } = this.data;
    console.log('Description when editing:', post.images); 
    this.setData({
      isEditing: true,
      editedTitle: post.title,
      editedDescription: post.describe || "",
      editedLocation: post.location,
      imageList: post.images || []
    });
  },

  handleCancelEdit() {
    this.setData({ isEditing: false });
  },

  handleSave() {
    const postId = this.data.post._id;
    const { editedTitle, editedDescription, editedLocation, imageList } = this.data;

    wx.request({
      method: 'PUT',
      url: `${wx.getStorageSync('apiBaseUrl')}/api/${postId}/edit`,
      data: {
        title: editedTitle,
        describe: editedDescription,
        location: editedLocation,
        images: imageList,
        tag: this.data.post.tag,
        userId: wx.getStorageSync('userinfo')._id
      },
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({ title: 'Editing Success ✅', icon: 'success' });
          this.setData({
            post: res.data,
            isEditing: false
          });
        } else {
          wx.showToast({ title: '更新失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '请求失败', icon: 'none' });
      }
    });
  },

  handleImageUpload() {
    wx.chooseImage({
      count: 9, // Allow up to 9 images
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFilePaths; // List of newly selected image file paths
        this.setData({
          imageList: [...this.data.imageList, ...newImages] // Add selected images to the current list
        });
      },
      fail: () => {
        wx.showToast({ title: '图片上传失败', icon: 'none' });
      }
    });
  },

  handleImageDelete(e) {
    const imageIndex = e.currentTarget.dataset.index; // Get the index of the image to be deleted
    const updatedImageList = this.data.imageList.filter((_, index) => index !== imageIndex); // Remove image by index
    this.setData({
      imageList: updatedImageList // Update the image list in the state
    });
  },

  onTitleInput(e) {
    this.setData({ editedTitle: e.detail.value });
  },

  onDescriptionInput(e) {
    this.setData({ editedDescription: e.detail.value });
  },

  onLocationInput(e) {
    this.setData({ editedLocation: e.detail.value });
  },

  handleDelete(e) {
    const postId = this.data.post._id; // or get from e.currentTarget.dataset.postId
    const userId = wx.getStorageSync('userId');
  
    wx.showModal({
      title: 'Consent Deletion',
      content: 'Are you sure you want to delete this post? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      success: (res) => {
        if (res.confirm) {
          // User confirmed
          wx.request({
            url: `${wx.getStorageSync('apiBaseUrl')}/api/${postId}/delete`,
            method: 'DELETE',
            data: {
              userId: userId
            },
            success: res => {
              if (res.statusCode === 200) {
                wx.showToast({ title: '删除成功', icon: 'success' });
                wx.navigateBack({
                  delta: 1, // Go back one page
                });
              } else {
                wx.showToast({ title: res.data.message || '删除失败', icon: 'none' });
              }
            },
            fail: err => {
              wx.showToast({ title: '请求失败', icon: 'none' });
              console.error('Delete error:', err);
            }
          });
        } else if (res.cancel) {
          console.log('用户取消删除');
        }
      }
    });
  }
});
