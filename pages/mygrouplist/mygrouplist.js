// pages/mygrouplist/mygrouplist.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activitylist:'',
    osspath: '',
    c_id:''//小区ID
  },
  //请求活动数据
  reqactivitydata() {
    let that = this;
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/activity-activity/getCommunityActivityList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        c_id: that.data.c_id
      },
      dataType: 'json',
      success(res) {
        that.setData({
          activitylist: res.data.data
        })
        console.log(res.data.data)
      }
    })
  },
  //删除小区活动
  deleteActivity:function(e){
    let id = e.currentTarget.dataset.id;
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/activity-activity/deleteCommunityActivity',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        id: id,
        community_id:this.data.c_id
      },
      dataType: 'json',
      success(res) {
        console.log(res.data.msg)
        wx.showToast({
          icon: 'success',
          title: res.data.msg,
        });  
      }
    })
    
    this.reqactivitydata();
  },
  //选择活动跳转
  chooseactivitybtn:function(){
    wx:wx.navigateTo({
      url: '../chooseactivity/chooseactivity?c_id='+this.data.c_id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })

    let that = this;
    let c_id = options.c_id;
    console.log(c_id);

    that.setData({
      osspath: app.globalData.osspath,
      c_id: c_id
    })

    this.reqactivitydata()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
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