const app = getApp();
import {
  get,
  remove,
  getByid
} from "../../utils/db"
Page({
  data: {
    userInfo: {}, //用户公开信息
    isLogin: false, //false 没有登录,true 登录
    tabBarTitle: ["菜单", "菜谱分类", "关注"], //tabBar 选项
    id: "" ,//自定义id
    sortArr:[] ,//菜谱分类
    menuList:[]  ,
    list:[]
    
  },
 async onShow() {
    // console.log(app);
    if (app.globalData.userInfo != null) {
      //渲染用户信息 
      var userInfo = app.globalData.userInfo;
      this.setData({
        userInfo,
        isLogin: true
      })
    } else {
      //回到app拿数据
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          isLogin: true
        })
      }
    };

    //查询菜谱分类
    var list = await get("menuType");
    var openid = wx.getStorageSync('openid')
    var menuList = await get("menu",{_openid:openid});
    // console.log(menuList);
    this.setData({
      sortArr: list.data,
      menuList:menuList.data
    });



      //关注查询
      var openid = wx.getStorageSync('openid')
      // console.log(result.data._openid);
      // var followId = result.data._openid
      var guanzhu = await get("follow", {
        _openid: openid
      })
      var menuIds = guanzhu.data;
      var like = []
      menuIds.forEach(async item => {
        // like.push( item.menuId)
        var promise = getByid("menu", item.menuId)
        like.push(promise)
      })
      var result = await Promise.all(like)
      var newArr = result.map(item=>{
       return item.data
      })
      // console.log(newArr)
      this.setData({
        list:newArr
      })
      // console.log(this.data.list)
  },
  //删除菜单
  delCdlb(e){
    console.log(e);
    let {id,index} = e.currentTarget.dataset;
    wx.showModal({
      title:"您确定要删除吗?",
      success:res=>{
        console.log(res);
        if(res.confirm){
          //删除数据库中的数据
          remove("menu",id);
          //删除页面中的数据
          this.data.menuList.splice(index,1);
          this.setData({
            menuList:this.data.menuList
          })
        }
      }
    })
  },
  //去详情
  toDetail(e){
    console.log(e);
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/recipeDetail/recipeDetail?id='+id,
    })
  },
  //去菜谱分类
  toTypeList(e){
    console.log(e);
    wx.navigateTo({
      url: '/pages/typelist/typelist',
    })
  },



  

  //点击登录获取用户信息
  clickInfo(e) {
    console.log(e);
    this.setData({
      userInfo: e.detail.userInfo,
      isLogin: true
    })
  },

  //点击头像跳转到添加菜谱页面
  toAddMenu() {
    wx.navigateTo({
      url: '/pages/pbmenutype/pbmenutype'
    })
  },
  //点击加号去菜单发布
  toPbmenu() {
    wx.navigateTo({
      url: '/pages/pbmenu/pbmenu',
    })
  },


  //自定义下标(传id)
  clickItem(e) {
    // console.log(e);
    var id = e.target.id;
    this.setData({
      id: id
    })
  },


  
})