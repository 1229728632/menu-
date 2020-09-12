const db = wx.cloud.database();
const app = getApp();
import {
  get,
  add
} from "../../utils/db";
import {
  multiUpload
} from "../../utils/tools"
Page({
  data: {
    userInfo:{},     //用户公开信息
    sortArr: [],    //动态菜谱分类
    files: [],     //临时路径
    menuName: "",       //菜谱名称
    recipeTypeid:"",  //菜谱分类
    desc: "",       //做法
    fileid:"",     //菜谱图片
    nickName:"",  //添加人的昵称
    avatarUrl:"", //添加人的头像
    follows:0,   //关注数
    views:0      //访问数
  },
  //一进页面就查询菜谱分类
  async onLoad() {
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
    var list = await get("menuType");
    // console.log(list);
    this.setData({
      sortArr: list.data
    })
  },
  //选择图片把;临时路径渲染到页面
  bindselect(e) {
    // console.log(e);
    var tempFilePaths = e.detail.tempFilePaths;
    var files = tempFilePaths.map(item => {
      return {
        url: item
      }
    })
    this.setData({
      files
    })
  },
  // 点击发布
  async fbcd(e) {
    // console.log(e);
    var result = await multiUpload(this.data.files);
    // console.log(result);
    var fileid = result.map(item => {
      return item.fileID
    })
    //表单解析
    const {
      menuName,
      recipeTypeid,
      desc
    } = e.detail.value;
    this.setData({
      menuName,
      recipeTypeid,
      desc,
    })
    //添加数据库
    var data = {
      menuName,      ////菜谱名称
      recipeTypeid, //菜谱分类
      fileid,        //菜谱图片
      desc,           //做法
      nickName:this.data.userInfo.nickName,  //添加人的昵称
      avatarUrl:this.data.userInfo.avatarUrl, //添加人的头像
      follows:0,   //关注数
      views:0      //访问数
    };
    var result = await add("menu", data);
    // console.log(result);
    wx.showToast({
      title: '发布成功',
    });
    this.setData({
      menuName:"",
      recipeTypeid:"",
      files:[],
      desc:""
    })

  }
})