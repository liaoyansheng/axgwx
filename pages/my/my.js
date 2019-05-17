// pages/my/my.js
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    USER:{},
    info:{},
    community_list:[],
    idx:'',
    c_id:'',//团长选择的小区ID
  },
  toorderslist1:function(){
    wx:wx.navigateTo({
      url: '../orderslist/orderslist?' + 'statu=0',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toorderslist2: function () {
    wx: wx.navigateTo({
      url: '../orderslist/orderslist?'+'statu=2',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toorderslist3: function () {
    wx: wx.navigateTo({
      url: '../orderslist/orderslist?' + 'statu=3',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toorderslist4: function () {
    wx: wx.navigateTo({
      url: '../orderslist/orderslist?' + 'statu=4',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toorderslist5: function () {
    wx: wx.navigateTo({
      url: '../orderslist/orderslist?' + 'statu=5',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  userpoints:function(){
    wx.showToast({
      icon: 'none',
      title: '该功能暂未开放！',
    })
    wx.navigateTo({
      url: '../livePayment/livePayment',
    })
  },
  tooftenconsignee:function(){
    wx.navigateTo({
      url: '../oftenconsignee/oftenconsignee',
    })
  },
  toaccountconfigure:function(){
    wx.navigateTo({
      url: '../accountconfigure/accountconfigure'
    })
  },
  touseragreement:function(){
    wx.navigateTo({
      url: '../useragreement/useragreement',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //我的团购活动
  mygroupactive: function () {
    let that = this;
    //请求团长管理的小区
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/user-user/getCommunityList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        id: that.data.USER.id
      },
      dataType: 'json',
      success(res) {
        that.setData({
          community_list: res.data.data.community_list,
          c_id: res.data.data.community_list[0].id
        })
        console.log(that.data.community_list)
      }
    })

    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideView() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
    this.setData({
      showpayment: true,
      showQRcode: false,
    });
  },

  //选中团长小区
  btn_sub: function (e) {
    var idx = e.currentTarget.dataset.idx; //获取ID值
    var id = e.currentTarget.dataset.id; //获取ID值
    this.setData({
      idx: idx,
      c_id:id,
    })
    console.log(this.data.c_id);
  },

//我的团购活动
  tomygrouplist:function(){
    wx:wx.navigateTo({
      url: '../mygrouplist/mygrouplist?c_id='+this.data.c_id,
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
    let that = this

    var url = app.getCurrentUrl(options);

    //判断是否登录
    app.checkLogin(url).then(function () {
      var user = app.getStorageSync('user_more', false);
      that.setData({
        USER: user.USER
      })
      console.log(user.USER);

      that.newinfo();
    })

    // this.newinfo();

  },

//刷新用户信息
newinfo:function(){
  let that = this;
  var user = app.getStorageSync('user_more', false);
  wx.request({
    url: app.globalData.axgApi + '/user-user/getUserInfo',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': 'PHPSESSID=' + user.sessionid
    },
    data: {
      id: that.data.USER.id
    },
    dataType: 'json',
    success(res) {
      that.setData({
        info: res.data.data
      })
      console.log(res.data.data)
    }
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
    let that = this;
    var user = app.getStorageSync('user_more', false);
    that.setData({
      USER: user.USER
    })
    console.log(user.USER);

    this.newinfo();
    this.hideView();
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
      path: 'pages/my/my?c_id='+that.USER.c_id
    }
  },






})