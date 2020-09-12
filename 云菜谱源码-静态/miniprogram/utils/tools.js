/*
 * 上传文件到云存储
 * @params   _filePath   文件临时路径
 * 			_cloudPath   文件上传服务器后的云端路径
 */
async function upload(_filePath) {
	var ext = _filePath.split(".").pop()
	var nowtime = new Date().getTime();
	return await wx.cloud.uploadFile({
		cloudPath: nowtime + "." + ext,
		filePath: _filePath
	})
}


/*
 *  批量上传
 *  @params   tempFilePaths   数组   临时文件地址组成的数组  
 * 									例子：["http://tem/XXX.jpg","http://tem/XXX.jpg"]
 * 
 */
async function multiUpload(tempFilePaths) {
	var arr = []
	tempFilePaths.forEach(item => {
		var newtime = new Date().getTime();
		var ext = item.url.split(".").pop();
		var promise = wx.cloud.uploadFile({
			cloudPath: newtime + "." + ext,
			filePath: item.url
		})
		arr.push(promise)
	})
	var result = await Promise.all(arr);

	//所有上传都完成，返回一个结果
	return await Promise.all(arr);
}

export {
	upload,
	multiUpload
}