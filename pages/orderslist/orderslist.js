// pages/orderslist/orderslist.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: 0,
    searchTip: ['输入订单号查询订单', '搜索'],//搜索
    searchName: '',//搜索框值
    orderlist:[],//订单列表
    products:[],//产品列表
    pagesize: 20,//页数
    pageno: 1,//页码
    pageStatus: true,//默认是可以正常翻页
  },
  //搜索框的值
  searchInput: function (e) {
    let that = this;
    let searchName = e.detail.value;
    console.log(searchName);
    that.setData({
      searchName: searchName,
    })
  },
  //搜索方法
  searchBtn: function () {
    let that = this;
    that.data.pageno = 1;
    that.data.pageStatus = true;
    var user = app.getStorageSync('user_more', false);
    if (that.data.searchName) {
      // 请求订单列表
      wx.request({
        url: app.globalData.axgApi + '/order-order/getOrderList',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + user.sessionid
        },
        data: {
          order_number: that.data.searchName,
          u_id: that.data.USER.id,
          status: that.data.statu
        },
        dataType: 'json',
        success(res) {
          let orderList = res.data.data;
          orderList.map(item => {
            item.products = JSON.parse(item.products)
            return item
          })
          console.log(orderList)
          that.setData({
            orderlist: orderList,
          })
        }
      })
    }
  },
  /**
 * 跳转到产品详情页面
 */
  toproductsdetails(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../productsdetails/productsdetails?id=' + id
    })
  },

  //请求订单数据
  requestorderlist:function(){
    let that = this;
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/order-order/getOrderList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        u_id: that.data.USER.id,
        status: that.data.statu
      },
      dataType: 'json',
      success(res) {
        let orderList = res.data.data;
        orderList.map(item => {
          item.products = JSON.parse(item.products)
          return item
        })
        console.log(orderList)
        that.setData({
          orderlist: orderList,
        })
      }
    })
  },
  //全部
  tostatu1:function(){
    let that =this;
    that.setData({
      statu: 0,
    })
    // 请求订单列表

    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/order-order/getOrderList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        u_id:that.data.USER.id
      },
      dataType: 'json',
      success(res) {
        let orderList = res.data.data;
        orderList.map(item => {
          item.products = JSON.parse(item.products)
          return item
        })
        console.log(orderList)
        that.setData({
          orderlist: orderList,
        })
      }
    })
  },
  //待付款
  tostatu2: function () {
    let that = this;
    that.setData({
      statu: 1,
    })
    // 请求订单列表
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/order-order/getOrderList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        u_id: that.data.USER.id,
        status:1
      },
      dataType: 'json',
      success(res) {
        let orderList = res.data.data;
        orderList.map(item=>{
          item.products = JSON.parse(item.products)
          return item
        })
        console.log(orderList)
        that.setData({
          orderlist: orderList,
        })
      }
    })
  },
  //待发货
  tostatu3: function () {
    let that = this;
    that.setData({
      statu: 2,
    })
    // 请求订单列表

    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/order-order/getOrderList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        u_id: that.data.USER.id,
        status: 2
      },
      dataType: 'json',
      success(res) {
        let orderList = res.data.data;
        orderList.map(item => {
          item.products = JSON.parse(item.products)
          return item
        })
        console.log(orderList)
        that.setData({
          orderlist: orderList,
        })
      }
    })
  },
  //已发货
  tostatu4: function () {
    let that = this;
    that.setData({
      statu: 3,
    })
    // 请求订单列表

    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/order-order/getOrderList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        u_id: that.data.USER.id,
        status: 3
      },
      dataType: 'json',
      success(res) {
        let orderList = res.data.data;
        orderList.map(item => {
          item.products = JSON.parse(item.products)
          return item
        })
        console.log(orderList)
        that.setData({
          orderlist: orderList,
        })
      }
    })
  },
  //已关闭
  tostatu5: function () {
    let that = this;
    that.setData({
      statu: 5,
    })
    // 请求订单列表
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/order-order/getOrderList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        u_id: that.data.USER.id,
        status: 5
      },
      dataType: 'json',
      success(res) {
        let orderList = res.data.data;
        orderList.map(item => {
          item.products = JSON.parse(item.products)
          return item
        })
        console.log(orderList)
        that.setData({
          orderlist: orderList,
        })
      }
    })
  },
  //删除订单
  deleteOrder:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/order-order/deleteOrder',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        order_number: id
      },
      dataType: 'json',
      success(res) {
        wx.showToast({
          icon: 'success',
          title: '删除订单成功',
        })
        that.requestorderlist();
      }
    })
  },
  //订单详情
  toordersdetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../ordersdetail/ordersdetail?id=' + id,
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
      title: '加载中...',
      mask: true,
    });

    let that = this;

    var url = app.getCurrentUrl(options);
    //判断是否登录
    app.checkLogin(url).then(function () {
      
    var user = app.getStorageSync('user_more', false);
    that.setData({
      USER: user.USER,
      osspath: app.globalData.osspath
    })
    if (options.statu == 0){
      console.log("测试全部")
      that.tostatu1();
    }
    else if(options.statu == 2){
      that.tostatu2();
    }
    else if (options.statu == 3) {
      that.tostatu3();
    }
    else if (options.statu == 4) {
      that.tostatu4();
    }
    else if (options.statu == 5) {
      that.tostatu5();
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
    let that = this;
    that.data.pageno++;//搜索的时候初始化页码
    console.log('页码' + that.data.pageno);
    if (that.data.pageStatus) {
      that.data.pageStatus = true;
      wx.showLoading({
        title: '加载中...',
      })
      // 请求订单列表
      var user = app.getStorageSync('user_more', false);
      wx.request({
        url: app.globalData.axgApi + '/order-order/getOrderList',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + user.sessionid
        },
        data: {
          u_id: that.data.USER.id,
          status: that.data.statu,
          pagesize: that.data.pagesize,
          pageno: that.data.pageno,
        },
        dataType: 'json',
        success(res) {
          console.log(res.data.data);
          wx.hideLoading();
          if (res.data.data.length > 0) {
            let orderList = res.data.data;
            orderList.map(item => {
              item.products = JSON.parse(item.products)
              return item
            })
            let orderlist = that.data.orderlist.concat(orderList);
            that.setData({
              orderlist: orderlist,
              pageStatus: true,
            })
          } else {
            wx.showToast({ title: '已无更多订单！', icon: 'none', duration: 2000 });
            that.data.pageStatus = false;
          }
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showToast({ title: '系统繁忙...', icon: 'none', duration: 2000 });
          that.data.pageStatus = true;
        }
      })

    } else {
      wx.showToast({ title: '已无更多订单信息！', icon: 'none', duration: 2000 });
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '安心购-社区团购平台',
      desc: '安心购：大型社区团购平台，精选特卖、全城最低价商品，快乐抢购吧！',
      path: 'pages/orderlist/orderlist?c_id=' + that.data.USER.c_id
    }
  },

  //付款
  orderpay:function(e){
    let that = this;
    let order_number = e.currentTarget.dataset.id;
    let user_id = that.data.USER.id
    // 调用服务器支付接口
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/pay/wxappdopay',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        order_number,
        openid: that.data.USER.wxappopenid
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
                that.requestorderlist();
              }
            })
          },
          'fail': function (res) {
            // wx.showToast({ title: res.errMsg, icon: 'none' })
          }
        })
      },
      fail(err) {
        wx.showToast({ title: '系统繁忙，请稍后访问', icon: 'none', duration: 2000 })
      }
    })

  }
})