const db = wx.cloud.database();
var app = getApp();
import {
  get
} from "../../utils/db"
Page({
  data: {
    crr:0,
    userInfo: {}, //用户公开信息
    menuList: [], //菜单列表
    keyword: "" //输入框中的值
  },
  swiperChange(e) {
    // console.log(e);
    var crr = e.detail.current;
    this.setData({
      crr: crr
    })
    // console.log(crr)
  },
  async onShow() {
    //  console.log(app);
    if (app.globalData.userInfo != null) {
      //渲染用户信息 
      var userInfo = app.globalData.userInfo;
      this.setData({
        userInfo,
      })
    } else {
      //回到app拿数据
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    };
    //查询菜单信息
    var openid = wx.getStorageSync('openid');
    // console.log(openid);
    var menuList = await get("menu", {
      _openid: openid
    });
    // console.log(menuList);
    this.setData({
      menuList: menuList.data,
    })
  },
  toDetail(e) {
    // console.log(e);
    var id = e.currentTarget.id;
    // console.log(id);
    wx.navigateTo({
      url: '/pages/recipeDetail/recipeDetail?id=' + id,
    })
  },
  toTypeList(e) {
    // console.log(e);
    wx.navigateTo({
      url: '/pages/typelist/typelist',
    })
  },
  //获取输入值
  myIpt(e) {
    // console.log(e);
    this.data.keyword = e.detail.value
  },
  //点击去到搜索列表
  toList() {
    //1.存储缓存
    var keyword = this.data.keyword

    var arr = wx.getStorageSync('keyword') || []
    var index = arr.findIndex(item => {
      return item == keyword
    })
    if (index != -1) {
      arr.splice(index, 1)
    }
    arr.unshift(keyword);
    wx.setStorageSync('keyword', arr)
    //2.页面跳转
    wx.navigateTo({
      url: '/pages/recipelist/recipelist?keyword=' + this.data.keyword,
    });
  }
})