// pages/oftenconsignee/oftenconsignee.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    consigneename:'',
    consigneetel:'',
  },
//获取用户填写姓名
  getname:function(e){
    let that = this;
    let name = e.detail.value;
    console.log(name);
    that.setData({
      consigneename: name,
    })
  },
  keepname:function(){
    let that = this;
    var user = app.getStorageSync('user_more', false);
    let id = user.USER.id

    wx:wx.request({
      url:app.globalData.axgApi+'/user-user/updateUser',
      data: {
        id:id,
        consignee_name: that.data.consigneename,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        if (res.data.code == 200) {
        that.setData({
          showModalStatus: false
        })
        wx.showToast({
          title: '修改姓名成功',
          icon: 'success',
          duration: 2000
        })
        } else {
          wx.showToast({
            title: '系统错误',
            duration: 2000
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }, 
  //获取用户填写手机号
  gettel:function(e){
    let that = this;
    let tel = e.detail.value;
    that.setData({
      consigneetel: tel,
    })
  },
  keeptel:function(){
    let that = this;
    var reg = /1+[0-9]{10}/;
    if (that.data.consigneetel.length != 11 || reg.test(that.data.consigneetel) == false) {
      wx.showToast({
        icon: 'none',
        title: '手机号格式错误！',
      })
    }
    else {
    var user = app.getStorageSync('user_more', false);
    let id = user.USER.id
    wx: wx.request({
      url: app.globalData.axgApi + '/user-user/updateUser',
      data: {
        id: id,
        consignee_tel: that.data.consigneetel,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res)
        if(res.data.code == 200){
          that.setData({
            showModalStatus1: false
          })
          wx.showToast({
            title: '修改手机号成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '系统错误',
            duration: 2000
          })
        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    });

    let that = this
    var url = app.getCurrentUrl(options);
    //判断是否登录
    app.checkLogin(url).then(function () {

    var user = app.getStorageSync('user_more', false);
    that.setData({
      USER: user.USER,
      
    })

    wx.request({
      url: app.globalData.axgApi + '/user-user/getConsignee',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        id:that.data.USER.id
      },
      dataType: 'json',
      success(res) {
        console.log(res.data);
        that.setData({
          consigneename: res.data.data.consignee_name,
          consigneetel: res.data.data.consignee_tel,
        })
      }
    })
  
  })
  },
  //更换姓名窗口
  editname: function (e) {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()

    let data = e.target.dataset;
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
  // 隐藏遮罩层
  hideView() {
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
  },
  //更换手机号窗口
  editnumber: function (e) {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()

    let data = e.target.dataset;
    this.setData({
      animationData1: animation.export(),
      showModalStatus1: true,
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData1: animation.export()
      })
    }.bind(this), 200)
  },
  // 隐藏遮罩层
  hideView1() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData1: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData1: animation.export(),
        showModalStatus1: false
      })
    }.bind(this), 200)
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
      path: 'pages/oftenconsignee/oftenconsignee?c_id=' + that.data.USER.c_id
    }
  }
})