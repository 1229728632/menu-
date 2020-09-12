let app = getApp();
const db = wx.cloud.database()
import {
  get,
  remove,
  getByid
} from "../../utils/db"
Page({
  data: {
    tabBarTitle: ["菜单", "菜谱分类", "关注"], //tabBar 选项
    idStyle: "", //自定义id
    menuList: [], //菜单列表
    sortArr: [], //菜谱分类
    list: [], //关注
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
    //查询菜单
    var openid = wx.getStorageSync('openid')
    var menuList = await get("menu", {
      _openid: openid
    });
    this.setData({
      menuList: menuList.data //菜单列表
    });

    //查询分类
    var list = await get("menuType");
    this.setData({
      sortArr: list.data,
    });
    //关注查询
    var openid = wx.getStorageSync('openid');
    var result = await db.collection("follow").where({
      _openid: openid
    }).get();
    // console.log(result);
    var arr = result.data.map(item => {
      return item.menuId
    })
    //根据menuId数组,获取menu详细
    var list = await db.collection("menu").where({
      _id: db.command.in(arr)
    }).get()
    // console.log(list);

    // console.log(arr);
    this.setData({
      list: list.data
    })
  },

  //菜单删除
  async delCdlb(e) {
    let {
      id,
      index
    } = e.currentTarget.dataset;
    // console.log(id, index);
    var ff = await get("follow")
    var dd = ff.data
    wx.showModal({
      title: "您确定要删除吗?",
      success: res => {
        //如果点击了确定
        if (res.confirm) {
          //删除数据中的数据
          remove("menu", id);
          this.data.menuList.splice(index, 1);
          dd.forEach(item => {
            var menuid =  item.menuId;
           if( menuid == id){
             var menuId = item._id;
             remove("follow",menuId);
             this.data.list.splice(index, 1);
           }
          })
          this.setData({
            menuList: this.data.menuList,
            list:this.data.list
          })
        }
      }
    })
  },
  //菜单去详情
  toDetail(e) {
    // console.log(e);
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/recipeDetail/recipeDetail?id=' + id,
    })
  },
  //菜谱分类去
  toTypeList(e) {
    // console.log(e);
    var name = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/recipelist/recipelist?id=' + name,
    })
  },
  //关注进详情
  guanzhuDetail(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/recipeDetail/recipeDetail?id=' + id,
    })
  },

  //动态样式
  clickItem(e) {
    // console.log(e);
    var idStyle = e.target.id;
    this.setData({
      idStyle: idStyle
    })
  },
  //点击登录获取用户信息
  clickInfo(e) {
    // console.log(e);
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
})