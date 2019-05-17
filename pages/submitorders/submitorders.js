// pages/submitorders/submitorders.js
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id:'',//活动ID
    USER:'',//缓存信息
    consignee_name:'',//常用收货信息
    consignee_tel:'',
    address:'',//收货地址
    address_id:'',//收货地址的小区ID
    addresslist:{},//所有小区地址
    adstatu:true,//地址编辑状态
    user:{},
    products:[],
    osspath:'',
    comment:'',//买家留言
    order_number:'',//订单号
    g_type:'',//从购物车进来
  },

//编辑修改收货信息状态
  adedit:function(){
    this.setData({
      adstatu:false
    });
  },
  adedit1: function () {
    let that = this;
    var reg = /1+[0-9]{10}/;
    if (that.data.consignee_tel.length != 11 || reg.test(that.data.consignee_tel) == false){
      wx.showToast({
        icon: 'none',
        title: '手机号格式错误！',
      })
    } else if (that.data.consignee_name == ''){
      wx.showToast({
        icon: 'none',
        title: '请填写提货人姓名！',
      })
    }else{
      var user = app.getStorageSync('user_more', false);	
      wx: wx.request({
        url: app.globalData.axgApi + '/user-user/updateUser',
        data: {
          id: that.data.USER.id,
          consignee_name: that.data.consignee_name,
          consignee_tel: that.data.consignee_tel
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
          that.setData({
            adstatu: true
          });
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }

  },
  //获取买家留言
  getcomment: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  //获取用户填写收货人
  getname: function (e) {
    this.setData({
      consignee_name: e.detail.value
    })
  },
  //获取联系方式
  gettel: function (e) {
    this.setData({
      consignee_tel: e.detail.value
    })
  },
  //更换地址窗口
  replacead: function (e) {
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

    //请求所有小区地址
    let that = this;
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/community-community/getAllCommunity',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
      },
      dataType: 'json',
      success(res) {
        that.setData({
          addresslist: res.data.data
        })
        console.log(res.data.data);
      }
    })
  },
  // 隐藏选择地址弹窗遮罩层
  hideView() {
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
  //选择地址
  ischeck:function(e){
    this.setData({
      isChecked: e.currentTarget.dataset.index,
      address: e.currentTarget.dataset.ad,
      address_id: e.currentTarget.dataset.c_id
    });

  },
  //确定地址保存
  keepAdress:function(){
    let that = this;
    var user = app.getStorageSync('user_more', false);

    if (that.data.address_id){

    wx: wx.request({
      url: app.globalData.axgApi + '/user-user/updateUser',
      data: {
        c_id: that.data.address_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res);
        if (res.data.code == 200){
          user.USER.c_id = that.data.address_id;
          wx.setStorageSync("user_more", user);
          that.hideView();
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    if (options.g_type) {
      that.setData({
        g_type: 1
      })
    }
    if (options.activity_id){
      let activity_id = options.activity_id;
      that.setData({
        activity_id: activity_id
      })
    }
    let products=options.products;
    let counts=options.counts;
    
    var url = app.getCurrentUrl(options);
    //判断是否登录
    app.checkLogin(url).then(function () {


    var user = app.getStorageSync('user_more', false);
    that.setData({
      USER: user.USER,
    })

    //获取默认收货地址
    wx.request({
      url: app.globalData.axgApi + '/community-community/getDefaultAddress',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        c_id: that.data.USER.c_id
      },
      dataType: 'json',
      success(res) {
        if (res.data.data.length == 0){
          that.setData({
            address: ""
            // address: "请选择送货小区"
          })
        }else{
        that.setData({
          address: res.data.data.addressdetail +'('+ res.data.data.c_name + ')'
        })
        }
        console.log(res.data);
      }
    }) 

    //获取常用收货人
    wx.request({
      url: app.globalData.axgApi + '/user-user/getConsignee',
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
        if (res.data.data.consignee_name == '' || res.data.data.consignee_tel==''){
          that.setData({
            adstatu: false,//地址编辑状态
          })
        }
        that.setData({
          consignee_name: res.data.data.consignee_name,
          consignee_tel: res.data.data.consignee_tel
        })
        console.log(res.data.data);
      }
    })   

    //请求购买产品数据
    wx.request({
      url:app.globalData.axgApi+'/product-product/getProductListData',
      method:'POST',
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data:{
        products,
        counts
      },
      dataType:'json',
      success(res){
        that.setData({
            products:res.data.data.product_list,
            amount: res.data.data.amount.toFixed(2),
            osspath:res.data.osspath
        })
        console.log(res.data);
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
      title: that.data.product.name + '--安心购',
      desc: '安心购：大型社区团购平台，精选特卖、全城最低价商品，快乐抢购吧！',
      path: 'pages/submitorders/submitorders?c_id=' + that.data.USER.c_id
    }
  },


  /**
   * 提交订单
   * @param e
   */
  commitOrder(e){
    let that = this;
    let products = JSON.stringify(that.data.products);
    let user = app.getStorageSync('user_more',false)
    let user_id=user.USER.id

    //保存收货人信息
    if (that.data.adstatu == false){
      var reg = /1+[0-9]{10}/;
      if (that.data.consignee_tel.length != 11 || reg.test(that.data.consignee_tel) == false) {
        wx.showToast({
          icon: 'none',
          title: '手机号格式错误！',
        })
      } else if (that.data.consignee_name == '') {
        wx.showToast({
          icon: 'none',
          title: '请填写提货人姓名！',
        })
      } else if (that.data.address == '') {
        wx.showToast({
          icon: 'none',
          title: '请选择提货地址！',
        })
      } else {
        wx.request({
          url: app.globalData.axgApi + '/user-user/updateUser',
          data: {
            id: that.data.USER.id,
            consignee_name: that.data.consignee_name,
            consignee_tel: that.data.consignee_tel
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
          },
          fail: function (res) { },
          complete: function (res) { },
        })
        // 创建订单
        wx.request({
          url:app.globalData.axgApi+'/order-order/commitOrder',
          method:'POST',
          header:{
            'content-type':'application/x-www-form-urlencoded',
            'Cookie': 'PHPSESSID=' + user.sessionid
          },
          data:{
            name: that.data.consignee_name,
            tel: that.data.consignee_tel,
            address: that.data.address,
            products: products,
            comment: that.data.comment,
            create_user: that.data.USER.id,
            amount: that.data.amount,
            activity_id: that.data.activity_id,
            g_type: that.data.g_type
          },
          dataType:'json',
          success(res){
            console.log("提交订单-----------")
            console.log(res.data)
            let order_number=res.data.data.order_number

            // 调用服务器支付接口
            wx.request({
              url:app.globalData.axgApi+'/pay/wxappdopay',
              method:'POST',
              header:{
                'content-type':'application/x-www-form-urlencoded',
                'Cookie': 'PHPSESSID=' + user.sessionid
              },
              data:{
                order_number,
                openid:user.USER.wxappopenid
              },
              dataType:'json',
              success(res){
                console.log("支付接口请求成功-----------")
                console.log(res)
                // 小程序发起支付
                wx.requestPayment({
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.paySign,
                  'success': function (res) {
                    wx.request({
                      url:app.globalData.axgApi+'/order-order/finishPay',
                      method:'POST',
                      header:{
                        'content-type':'application/x-www-form-urlencoded',
                        'Cookie': 'PHPSESSID=' + user.sessionid
                      },
                      data:{
                        order_number,
                        user_id
                      },
                      dataType:'json',
                      success(res){
                        console.log("支付成功");
                        wx: wx.navigateTo({
                          url: '../orderslist/orderslist?' + 'statu=0',
                          success: function (res) { },
                          fail: function (res) { },
                          complete: function (res) { },
                        })
                      }
                    })
                  },
                  'fail': function (res) {
                    // wx.showToast({ title: '取消支付',icon:'none' })
                  }
                })
              },
              fail(err){
                wx.showToast({ title: '系统繁忙，请稍后访问', icon: 'none', duration: 2000 })
              }
            })
          }
        })


      }
    }else{
//---------
      var reg = /1+[0-9]{10}/;
      if (that.data.consignee_tel.length != 11 || reg.test(that.data.consignee_tel) == false) {
        wx.showToast({
          icon: 'none',
          title: '手机号格式错误！',
        })
      } else if (that.data.consignee_name == '') {
        wx.showToast({
          icon: 'none',
          title: '请填写提货人姓名！',
        })
      } else if (that.data.address == '') {
        wx.showToast({
          icon: 'none',
          title: '请选择提货地址！',
        })
      } else {
        // 创建订单
        wx.request({
          url: app.globalData.axgApi + '/order-order/commitOrder',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': 'PHPSESSID=' + user.sessionid
          },
          data: {
            name: that.data.consignee_name,
            tel: that.data.consignee_tel,
            address: that.data.address,
            products: products,
            comment: that.data.comment,
            create_user: that.data.USER.id,
            amount: that.data.amount,
            activity_id: that.data.activity_id,
            g_type: that.data.g_type
          },
          dataType: 'json',
          success(res) {
            console.log("提交订单-----------")
            console.log(res.data)
            let order_number = res.data.data.order_number

            // 调用服务器支付接口
            wx.request({
              url: app.globalData.axgApi + '/pay/wxappdopay',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'PHPSESSID=' + user.sessionid
              },
              data: {
                order_number,
                openid: user.USER.wxappopenid
              },
              dataType: 'json',
              success(res) {
                console.log("支付接口请求成功-----------")
                console.log(res)
                // 小程序发起支付
                wx.requestPayment({
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.paySign,
                  'success': function (res) {
                    wx.request({
                      url: app.globalData.axgApi + '/order-order/finishPay',
                      method: 'POST',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Cookie': 'PHPSESSID=' + user.sessionid
                      },
                      data: {
                        order_number,
                        user_id
                      },
                      dataType: 'json',
                      success(res) {
                        console.log("支付成功");
                        wx: wx.navigateTo({
                          url: '../orderslist/orderslist?' + 'statu=0',
                          success: function (res) { },
                          fail: function (res) { },
                          complete: function (res) { },
                        })
                      }
                    })
                  },
                  'fail': function (res) {
                    // wx.showToast({ title: '取消支付',icon:'none' })
                  }
                })
              },
              fail(err) {
                wx.showToast({ title: '系统繁忙，请稍后访问', icon: 'none', duration: 2000 })
              }
            })
          }
        })
      }
//---------
    }


  },

//优惠券
  discount:function(){
    wx.showToast({
      icon: 'none',
      title: '该功能暂未开放！',
    })

  }
})