// pages/talk/uploadNewAudio.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "Add new audio",
    categories: ["greetings", "entertainment", "foodshopping", "emergency", "transportation", "hotel"],
    selectedCategory: "", // Stores selected category
    types: ["normal", "question", "calculator"], // Checkbox options
    selectedTypes: [], // Stores selected types
    chinese:""
  },

  onChineseChange(e){
    this.setData({chinese:e.detail.value});
  },
   // Category Picker Change
   onCategoryChange(e) {
    this.setData({ selectedCategory: this.data.categories[e.detail.value] });
  },

  // Checkbox Selection Change
  onTypeChange(e) {
    const selectedValues = e.detail.value; // e.detail.value will be an array of selected values
    this.setData({
      selectedTypes: selectedValues // Update the selectedTypes array with the new selections
    });
    console.log("Selected Types:", selectedValues); // Debugging
  },
  // Form Submit
  submit(e) {
    const { chinese, selectedCategory, selectedTypes } = this.data;
    if (!chinese) {
      wx.showToast({
        title: '请填写中文内容',
        icon: 'none',
      });
      return;
    }
    // 校验category
    if (!selectedCategory) {
      wx.showToast({
        title: '请填写分类',
        icon: 'none',
      });
      return;
    }

    wx.request({
      url: `${wx.getStorageSync('apiBaseUrl')}/api/addPhrase`, // 替换成你的后端API URL
      method: 'POST',
      data: {
        chinese,
        category:selectedCategory,
        types:selectedTypes,
      },
      success: (res) => {
        if (res.data.success) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000,
          });
          // Delay to let toast finish before navigating back
          setTimeout(() => {
            const pages = getCurrentPages();
            const prevPage = pages[pages.length - 2]; // Get the previous page
            if (prevPage && typeof prevPage.onLoad === 'function') {
              prevPage.onLoad(); // Reload data on previous page
            }
            wx.navigateBack({ delta: 1 });
            }, 1000);
        } else {
          wx.showToast({
            title: '添加失败,请检查是否重复',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '请求失败，请稍后再试',
          icon: 'none',
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  goBack: function () {
    wx.navigateBack({
      delta: 1  // 返回到上一页，如果需要返回更多页，可以调整 delta 的值
    });
  },
})