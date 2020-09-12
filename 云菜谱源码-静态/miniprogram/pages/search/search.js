const db = wx.cloud.database();
Page({
  data: {
    keyWord: "",
    arr: [],
    views: [] //热门搜索
  },
  async onLoad() {
    var result = await db.collection("menu").orderBy("views", "desc").limit(6).get();
    // console.log(result);

    this.setData({
      views: result.data
    })

  },
  onShow() {
    var arr = wx.getStorageSync('keyword') || [];
    this.setData({
      arr
    })
    // console.log(arr);

  },
  myInput(e) {
    // console.log(e);
    this.data.keyWord = e.detail.value
  },
  doSearch() {
    //本地
    var keyword = this.data.keyWord
    var arr = wx.getStorageSync('keyword') || []
    var index = arr.findIndex(item => {
      return item == keyword
    })
    if (index != -1) {
      arr.splice(index, 1)
    }
    arr.unshift(keyword);
    wx.setStorageSync('keyword', arr)
    //跳转页面
    wx.navigateTo({
      url: '/pages/recipelist/recipelist?keyword=' + this.data.keyWord,
    })
  },
  
  //搜索去
  searchToDetail(e) {
    // console.log(e);
    var Index = e.target.id;
    wx.navigateTo({
      url: '/pages/recipelist/recipelist?keyword=' + Index,
    })
  },

  //热门去搜索
  hotToDetail(e) {
    // console.log(e);
    var id = e.target.id
    wx.navigateTo({
      url: '/pages/recipeDetail/recipeDetail?id=' + id,
    })

  }
})