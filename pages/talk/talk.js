// pages/talk/talk.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title_text:'Conversation Assistance',
    items: [
      { name: "greetings" , pic:"/UI/talkUi/User-2 1.png"},
      { name: "entertainment" , pic:"/UI/talkUi/Place-2 1.png"},
      { name: "foodshopping" , pic:"/UI/talkUi/Like-2 1.png"},
      { name: "emergency" , pic:"/UI/talkUi/image 23.png"},
      { name: "transportation" , pic:"/UI/talkUi/Camera-2 1.png"},
      { name: "hotel" , pic:"/UI/talkUi/Basket-2 1.png"},
    ],
    generals: [
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.setNavigationBarTitle({
      title: this.data.title  // 动态设置导航栏标题
    });
    this.fetchCategories()
  },

  goBack: function () {
    wx.navigateBack();  // 返回上一页
  },

  onSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search'  // 跳转到搜索页面
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 }); // Highlight "Talk"
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

  fetchCategories: function() {
    wx.request({
      url: `${wx.getStorageSync('apiBaseUrl')}/api/normal`,  // 后端服务器地址
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          console.log(res.data.phrases)
          this.setData({
            generals: res.data.phrases  // 设置获取到的 categories 数据
          });
        } else {
          wx.showToast({
            title: '获取分类失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '请求失败，请稍后重试',
          icon: 'none'
        });
      }
    });
  },

  phrasesShow: function(event){
    const category = event.currentTarget.dataset.item;
    console.log(category)

    wx.navigateTo({
      url: `/pages/talk/phrases?categoryKey=${category}`,
    });
  },

  seeDetail:function(event){
    const phraseID = event.currentTarget.dataset.id;
    const title = event.currentTarget.dataset.title;
    wx.navigateTo({
      url: `/pages/talk/phrase?id=${phraseID}&title=${title}`,
    });
  },

  call191() {
    wx.makePhoneCall({
      phoneNumber: '191', // 电话号码
      success() {
        console.log('拨打成功');
      },
      fail() {
        console.log('拨打失败');
      }
    })
  }
})