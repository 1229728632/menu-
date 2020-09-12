const db = wx.cloud.database(); //拿到数据库引用

//添加数据
async function add(_collection = "", _data = {}) {
  return await db.collection(_collection).add({
    data: _data
  })
};

//id删除一条数据
async function remove(_collection="",id){
  return await db.collection(_collection).doc(id).remove();
};

//id修改
async function update(_collection="",id,_data){
  return await db.collection(_collection).doc(id).update({
    data:_data
  })
};

//条件查询
async function get(_collection="",_where={}){
  return await db.collection(_collection).where(_where).get();
}

//id查询
async function getByid(_collection="",id){
  return await db.collection(_collection).doc(id).get()
}

//导出
export {add,remove,update,get,getByid}