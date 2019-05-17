//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    options:{},//页面参数
    c_id:0 //小区id
  },

  login:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var param = {}
    var url = decodeURIComponent(options.url);
    app.getParam(url,param);
    var c_id = 0;
    if (param && param.c_id  && param.c_id != "undefined"){
      c_id = param.c_id
    }
    that.setData({
      options:options,
      c_id:c_id
    });
  },

  getUserInfo: function (e) {
    var that = this;
    wx.showLoading({
      title: '登录中...',
    });
    //此处授权得到userInfo
    // console.log(that.data.c_id);
    app.newlogin(that.data.c_id).then(function(){
      if (that.data.options.url && that.data.options.url != "undefined"){
        url = decodeURIComponent(that.data.options.url);
        console.log(url);
        var url = url.replace("pages",".."); 
        var param = app.getParam(url);
        wx.redirectTo({
          url: url,
        })
      }else{
        console.log("不是分享");
        wx.switchTab({
          url: '../index/index',
        })
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

  
})