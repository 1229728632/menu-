const db = wx.cloud.database()
import {
  add,
  get,
  update,
  remove
} from "../../utils/db"
Page({
  data: {
    isShowAdd: false, //添加
    isupdateSort: false, //修改
    sortArr: [], //菜单分类名称
    updateId: "",
    name:""

  },
  //一进页面就更新查询
  async onLoad() {
    var list = await get("menuType");
    this.setData({
      sortArr: list.data
    })
  },

  //点击添加按钮显示添加输入框
  addSort() {
    this.setData({
      isShowAdd: true,
      isupdateSort: false
    })
  },
  //点击修改出现修改输入框
  updateSort(e) {
    //每一个id
    // console.log(e);
    
    // console.log(e.currentTarget.id);
    this.setData({
      updateId: e.target.dataset.id,
      name: e.target.dataset.name
    })
    this.setData({
      isupdateSort: true,
      isShowAdd: false
    })
  },
  //添加菜谱分类
  async myaddSort(e) {
    // console.log(e);
    var adds = e.detail.value
    if(adds.adds == "" ){
      wx.showToast({
        title: '请输入菜谱名称',
        icon: 'none',
      })
      return;
    }
    var result = await add("menuType", adds);
    console.log(result);
    if (result) {
      //更新查询
      var list = await get("menuType");
      this.setData({
        sortArr: list.data,
        isShowAdd: false
      })
    }
    //添加成功
    wx.showToast({
      title: '添加成功',
    })
  },
  // 修改
  async myupdateSort(e) {
    var item_id = this.data.updateId;
    var updateValue = e.detail.value.updates;
    // console.log(updateValue);
    // console.log(item_id);
    var updates = await update("menuType", item_id, {
      adds: updateValue
    });
    // console.log(updates);
    //更新查询
    var list = await get("menuType");
    this.setData({
      sortArr: list.data,
      isupdateSort: false
    });
    wx.showToast({
      title: '修改成功',
    });
  },


  // 删除
  delSort(e) {
    // console.log(e);
    let {
      id,
      index
    } = e.currentTarget.dataset;
    //弹框
    wx.showModal({
      title: "亲,您确定要删除吗?",
      success: res => {
        if (res.confirm) {
          //删除数据中的数据
          remove("menuType", id);
          //删除页面中的数据
          this.data.sortArr.splice(index, 1);
          this.setData({
            sortArr: this.data.sortArr
          });
          wx.showToast({
            title: '删除成功',
          })
        }
      }
    })
  }
})