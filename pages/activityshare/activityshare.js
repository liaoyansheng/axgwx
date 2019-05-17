// pages/activityshare/activityshare.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // banner数据
    autoplay: true,
    current: 0,
    interval: 3000,
    duration: 500,
    bannerlist: [],

    //选择小区ID
    c_id:'',
  },
  //跳转活动详情
  toactivitydetails: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../activitydetails/activitydetails?id=' + id + '&c_id=' + that.data.c_id,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log(options.c_id);
    var url = app.getCurrentUrl(options);

    app.checkLogin(url).then(function () {
      // var user = app.getStorageSync('user_more', false);
      // var c_id = user.USER.c_id;
      // console.log(user.USER.c_id);
      var user = app.getStorageSync('user_more', false);
      that.setData({
        c_id: options.c_id,
        user: user.USER
      })
      // console.log(user);
      
      //小区首页轮播图
      wx.request({
        url: app.globalData.axgApi + '/banner-banner/getCommunityBanner',
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
            bannerlist: res.data.data,
          })
          console.log(that.data.bannerlist);
        }
      })
      // 小区首页数据
      wx.request({
        url: app.globalData.axgApi + '/activity-activity/getCommunityActivity',
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
          console.log(res.data.data);
          app.globalData.osspath = res.data.osspath;
          that.setData({
            activities: res.data.data,
            osspath: res.data.osspath
          })
        }
      })
    })
      
    
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
    var that = this;
    return {
      title: '安心购-社区团购平台',
      desc: '安心购：大型社区团购平台，精选特卖、全城最低价商品，快乐抢购吧！',
      path: 'pages/activityshare/activityshare?c_id=' + that.data.c_id
    }
  }
})