// pages/accountconfigure/accountconfigure.js
let app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    login_name:'',
    tel:'',
    head_src:'',
    contacts:{}
  },
  //获取用户填写昵称
  getloginname: function (e) {
    let that = this;
    let login_name = e.detail.value;
    console.log(login_name);
    that.setData({
      login_name: login_name,
    })
  },
  keeploginname:function(){
    let that = this;
    let id = that.data.USER.id
    var user = app.getStorageSync('user_more', false);
    wx: wx.request({
      url: app.globalData.axgApi + '/user-user/updateUser',
      data: {
        id: id,
        login_name: that.data.login_name,
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
        if (res.data.code == 200) {
        that.setData({
          showModalStatus2: false
        })
        wx.showToast({
          title: '修改昵称成功',
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
  },
  //获取用户填写姓名
  getname: function (e) {
    let that = this;
    let name = e.detail.value;
    console.log(name);
    that.setData({
      name: name,
    })
  },  
  keepname: function () {
    let that = this;
    let id = that.data.USER.id
    var user = app.getStorageSync('user_more', false);
    wx: wx.request({
      url: app.globalData.axgApi + '/user-user/updateUser',
      data: {
        id: id,
        name: that.data.name,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code == 200) {
        console.log(res)
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
      fail: function (res) { },
      complete: function (res) { },
    })
  },  
  //获取用户填写手机号
  gettel: function (e) {
    let that = this;
    let tel = e.detail.value;
    console.log(tel);
    that.setData({
      tel: tel,
    })
  },   
  keeptel: function () {
    let that = this;
    var reg = /1+[0-9]{10}/;

    if (that.data.tel.length != 11 || reg.test(that.data.tel) == false) {
      wx.showToast({
        icon: 'none',
        title: '手机号格式错误！',
      })
    }
    else {

    let id = that.data.USER.id
    var user = app.getStorageSync('user_more', false);	
    wx: wx.request({
      url: app.globalData.axgApi + '/user-user/updateUser',
      data: {
        id: id,
        tel: that.data.tel,
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
        if (res.data.code == 200) {
        that.setData({
          showModalStatus1: false
        })
        wx.showToast({
          title: '修改手机号成功',
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
      fail: function (res) { },
      complete: function (res) { },
    })

    }
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
  //更换昵称窗口
  editnickname: function (e) {
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
      animationData2: animation.export(),
      showModalStatus2: true,
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData2: animation.export()
      })
    }.bind(this), 200)
  },
  // 隐藏遮罩层
  hideView2() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData2: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData2: animation.export(),
        showModalStatus2: false
      })
    }.bind(this), 200)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    });

    let that = this;
    var url = app.getCurrentUrl(options);
    //判断是否登录
    app.checkLogin(url).then(function () {

    var user = app.getStorageSync('user_more', false);
    that.setData({
      USER: user.USER,
    })

    wx.request({
      url:app.globalData.axgApi+'/user-user/getContacts',
      method:'POST',
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data:{
        u_id: that.data.USER.id
      },
      dataType:'json',
      success(res){
        console.log(res);
        that.setData({
          name: res.data.data.name,
          login_name: res.data.data.login_name,
          tel: res.data.data.tel,
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
      path: 'pages/accountconfigure/accountconfigure?c_id=' + that.data.USER.c_id
    }
  }
})