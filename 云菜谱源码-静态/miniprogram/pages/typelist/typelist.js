const db = wx.cloud.database();
import {get} from "../../utils/db"
Page({
  data:{
    menutype:[]
  },
 async onShow(){
    var menutype =await get("menuType");
    // console.log(menutype);
    var menutype =  menutype.data;
    this.setData({
      menutype:menutype
    })
  },
  //点击去菜单列表
  toMenuList(e){
    console.log(e);
    var name = e.currentTarget.id;
    console.log(name);
    wx.navigateTo({
      url: '/pages/recipelist/recipelist?name='+name,
    })
  }
})