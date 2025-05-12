// pages/phrases/phrases.js
import checkLogin from '../../utils/checkLogin';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    categoryKey:'',
    phrases:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const categoryKey = options.categoryKey;
    this.setData({
      categoryKey: categoryKey,
      title:categoryKey // 设置categoryKey
    });
    // 根据categoryKey查询短语数据
    this.fetchPhrases(categoryKey);
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
    const selected = wx.getStorageSync("selectedTab") || 0;
    const tabbar = this.selectComponent("#custom-tabbar"); // 获取 tabbar 组件
    if (tabbar) {
      tabbar.setData({ selected });
    }
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

  fetchPhrases(categoryKey) {
    wx.request({
        url: `${wx.getStorageSync('apiBaseUrl')}/api/phrases/${categoryKey}`,  // 后端API地址
        method: 'GET',
        success: (result) => {
          console.log(result.data.phrases)
          // 将结果存储到data中，供页面使用
          this.setData({
            phrases: result.data.phrases // 假设返回的数据格式是短语数组
          });
        },
        fail: (error) => {
          console.error("获取短语失败", error);
        }
      })
    },

    goBack: function () {
      wx.navigateBack({
        delta: 1  // 返回到上一页，如果需要返回更多页，可以调整 delta 的值
      });
    },

    seeDetail:function(event){
      const phraseID = event.currentTarget.dataset.id;
      const title = event.currentTarget.dataset.title;
      wx.navigateTo({
        url: `/pages/talk/phrase?id=${phraseID}&title=${title}`,
      });
    },

    goToSubmit:function(){
      wx.navigateTo({
        url: '/pages/talk/uploadNewAudio',
      })
    }
})