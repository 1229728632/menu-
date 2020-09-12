const db = wx.cloud.database();
import {
  get
} from "../../utils/db"
Page({
  data: {
    recipeTypeid: {}, //传过来的唯一标识
    menuList: [], //菜单
    avatarUrl: "", //头像
    nickName: "", //昵称
    name: "", //用来做判断(搜索还是直接点击菜谱分类)
    e: []
  },
  onLoad(e) {
    console.log(e);
    var e = e
    this.setData({
      e: e
    })
  },
  async onShow() {
    var name = this.data.e.id;
    let keyword = this.data.e.keyword;
    console.log(name);
    console.log(keyword)

    if (name != undefined) {
      //条件查询
      var result = await get("menu", {
        recipeTypeid: name
      });
      // console.log(result);
      let menuList = result.data;
      this.setData({
        menuList: menuList,
        avatarUrl: menuList.avatarUrl,
        nickName: menuList.nickName
      });
    } 
    else {
      // 搜索查询
      var findmenu = await db.collection("menu").where({
        menuName: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }).get()
      // console.log(findmenu);
      var sou_list = findmenu.data;
      this.setData({
        menuList: sou_list
      })
    }
  },
  //点击去详情
  toDetail(e) {
    // console.log(e);
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/recipeDetail/recipeDetail?id=' + id,
    })
  }

})