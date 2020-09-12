let db = wx.cloud.database();
import {
  getByid,
  get
} from "../../utils/db"
Page({
  data: {
    detail: {},
    isFollow: false, //false 未关注 ,true已关注
    list: [],
    id: "",
  },
  onLoad(e) {
    // console.log(e);
    let id = e.id;
    this.setData({
      id: id
    })
  },
  async onShow() {
    let showId = this.data.id
    var result = await getByid("menu", showId);
    // console.log(result);
    this.setData({
      detail: result.data,
    });
    var result = await db.collection("menu").doc(this.data.id).update({
      data: {
        views: db.command.inc(1)
      }
    })
    // console.log(result);
    

    wx.setNavigationBarTitle({
      title: this.data.detail.menuName
    });

    // ============判断是否关注==================
    var openid = wx.getStorageSync('openid');
    var follow = await db.collection("follow").where({
      _openid: openid,
      menuId: this.data.id
    }).get()
    //判断
    if (follow.data.length > 0) {
      //已经关注
      this.data.followId = follow.data[0]._id;
      this.setData({
        isFollow: true
      })
    } else {
      //没有关注
      this.setData({
        isFollow: false
      })
    }
  },
  //进行关注
  async doFollow() {
    //点击关注,在Follow集合中插入记录,字段有_openid和menuid
    var result = await db.collection("follow").add({
      data: {
        menuId: this.data.id
      }
    })
    //menu表的follow累加
    result = await db.collection("menu").doc(this.data.id).update({
      data: {
        follows: db.command.inc(1)
      }
    })
    // console.log(result);
    //icon变成红色 收藏数+1
    this.data.detail.follows += 1;
    this.setData({
      isFollow: true,
      detail: this.data.detail
    })
  },
  //取消关注
  async cancleFollow() {
    var result = await db.collection("follow").doc(this.data.followId).remove()
    await db.collection("menu").doc(this.data.id).update({
      data: {
        follows: db.command.inc(-1)
      }
    })
    this.data.detail.follows -= 1;
    this.setData({
      isFollow: false,
      detail: this.data.detail
    })
  },


})