// pages/post/post.js
import checkLogin from '../../utils/checkLogin';
Page({
  enablePullDownRefresh: true,
  data: {
    categories: ['All', 'Spot', 'Shopping', 'Food'],
    selectedCategory: 'All',  // 默认分类
    isSearchBarVisible: false,  // 控制搜索框显示与否
    searchBarClass: '',
    searchQuery: '',  // 搜索框输入的内容
    posts: [],  // 从后台获取的数据
    filteredPosts: []  // 过滤后的帖子
  },

  onLoad() {
    this.fetchData();
  },
  onShow(){
    if (!checkLogin()) return;
    this.fetchData();
  },
  fetchData(){
    const query = wx.getStorageSync('query');
    console.log(query);
    if(query){
      this.searchPosts(query);
    }
    // 初始化时获取所有帖子数据
    wx.request({
      url: `${wx.getStorageSync('apiBaseUrl')}/api/posts`,  // 后端的接口地址
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          if(!this.data.filteredPosts==[]){
          this.setData({
            posts: res.data,
            filteredPosts: res.data  // 默认显示所有帖子
          });}else{
            this.setData({
              posts: res.data
            });
          }
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none',
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '请求失败，请检查网络连接',
          icon: 'none',
        });
      }
    });
  },

  // 分类切换
  changeCategory(e) {
    const selectedCategory = e.currentTarget.dataset.category;
    this.setData({
      selectedCategory,
      filteredPosts: this.filterPostsByCategory(selectedCategory)
    });
  },

  // 过滤帖子
  filterPostsByCategory(category) {
    if (category === 'All') {
      return this.data.posts; // 显示全部
    }
    
    // 假设 tag 是一个数组，检查该数组中是否包含该类别
    return this.data.posts.filter(post => 
      post.tag.some(tag => tag.toLowerCase() === category.toLowerCase())
    );
  },
  

  // 显示搜索框
  showSearchBar() {
    this.setData({
      isSearchBarVisible: true,
      searchBarClass: '' // 先挂载
    });
  
    // 下一帧再加 class，触发动画
    setTimeout(() => {
      this.setData({
        searchBarClass: 'show'
      });
    }, 20); // 等一个短时间，确保视图已更新
  },

  // 隐藏搜索框
  hideSearchBar() {
    this.setData({
      searchBarClass: 'slidingOut'
    });
  
    // 等待动画执行完再彻底移除
    setTimeout(() => {
      this.setData({
        isSearchBarVisible: false,
        searchBarClass: ''
      });
    }, 300); // 动画时间 = 0.3s
  },

  // 搜索输入事件
  onSearchInput(e) {
    const query = e.detail.value;
    this.setData({
      searchQuery: query,
    });
    this.searchPosts(this.data.searchQuery);
  },

  // 搜索函数：根据标题和位置进行搜索
  searchPosts(query) {
    if (!query) {
      return this.data.posts;  // 如果没有输入，显示所有帖子
    }
    // 从后端获取匹配的帖子
  wx.request({
    url: `${wx.getStorageSync('apiBaseUrl')}/api/searchPosts`,  // 后端搜索接口
    method: 'GET',
    data: {
      query: query  // 查询字符串
    },
    success: (res) => {
      if (res.statusCode === 200) {
        wx.setStorageSync('query', "");
        this.setData({
          filteredPosts: res.data.posts, // 更新页面上的帖子
        });
      } else {
        wx.showToast({
          title: '搜索失败',
          icon: 'none'
        });
      }
    },
    fail: () => {
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    }
  });
  },

  goToDetail(e) {
    const postId = e.currentTarget.dataset.id;
    const post = this.data.filteredPosts.find(item => item._id === postId);  // 使用 MongoDB 的 _id

    // 将帖子数据序列化成字符串
    const postStr = encodeURIComponent(JSON.stringify(post));
  
    // 跳转并传参
    wx.navigateTo({
      url: `/pages/post/postDetail?post=${postStr}`
    });
  },
  onPullDownRefresh() {
    this.onLoad();
  },
});
