// pages/talk/phrase.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    phrase:[],
    isCalculator: false,
    isQuestion: false,
    yesActive:true,
    noActive:true,
    display: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const phraseID = options.id;
    const title = options.title;
    console.log(title)
    this.setData({
      title: title // 设置categoryKey
    });
    // 根据categoryKey查询短语数据
    this.fetchPhrase(phraseID);
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

  fetchPhrase:function(phraseID){
    wx.request({
      url: `${wx.getStorageSync('apiBaseUrl')}/api/phrase/${phraseID}`,  // 后端API地址
      method: 'GET',
      success: (result) => {
        // 将结果存储到data中，供页面使用
        this.setData({
          phrase: result.data.phrase,  // 假设返回的数据格式是短语数组
          isCalculator: result.data.phrase.type.includes("calculator"),
          isQuestion: result.data.phrase.type.includes("question")
        });
      },
      fail: (error) => {
        console.error("获取短语失败", error);
      }
    });
  },

  goBack: function () {
    wx.navigateBack({
      delta: 1  // 返回到上一页，如果需要返回更多页，可以调整 delta 的值
    });
  },

  playAudio: function (event) {
    const audioUrl = event.currentTarget.dataset.audio;  // 获取音频链接
    
    const audio = wx.createInnerAudioContext();  // 创建音频上下文
    audio.src = audioUrl;  // 设置音频链接
    
    audio.play();  // 播放音频

    // 如果需要处理音频播放结束事件
    audio.onEnded(() => {
      console.log('音频播放完毕');
    });

    // 如果需要处理音频播放错误事件
    audio.onError((error) => {
      console.error('音频播放出错：', error);
    });
  },

  yesClick: function(){
    this.setData({noActive:false});
  },

  noClick: function(){
    this.setData({yesActive:false});
  },
  inputValue(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      display: this.data.display + value
    });
  },

  clear() {
    this.setData({
      display: ""
    });
  },

  calculate() {
    try {
      let result = eval(this.data.display);
      this.setData({
        display: String(result)
      });
    } catch (error) {
      this.setData({
        display: "错误"
      });
    }
  }
})