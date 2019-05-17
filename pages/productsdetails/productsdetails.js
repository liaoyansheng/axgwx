// pages/productsdetails/productsdetails.js
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyboxstatu:true,
    imgUrls: [],
    detailUrls:[],

    product:{},
    osspath:'',
    num:1,//购买数量
    cartnum:''//购物车数量
  },
  //跳转购物车
  toShoppingCart:function(){
    wx.showLoading({
      title: '加载中',
    })
    wx: wx.switchTab({
      url: '../ShoppingCart/ShoppingCart',
      success: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //跳转首页
  toindex: function () {
    wx.showLoading({
      title: '加载中',
    })
    wx: wx.switchTab({
      url: '../index/index',
      success: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //预览商品图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接   
      urls: this.data.imgUrls, // 需要预览的图片http链接列表
      success: function () {
        console.log('成功');
      }
    })
  },
  //预览商品详情图片
  previewDetail:function(e){
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接   
      urls: this.data.detailUrls, // 需要预览的图片http链接列表
      success: function () {
        console.log('成功');
      }
    })
  },
  shopbtn:function(){
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData1: animation.export(),
      showModalStatus1: true,
      buyboxstatu: false
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData1: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal1() {
    // 隐藏遮罩层
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
    this.setData({
      buyboxstatu: true
    });
  },
  buybtn: function () {
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
      buyboxstatu:false
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal() {
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
      buyboxstatu: true
    });
  },
  //下一步
  toOrderDetails(e){
    console.log(e.currentTarget.dataset)
    let id=e.currentTarget.dataset.id;
    let count=this.data.num;
    if(count == 0){
      wx.showToast({
        icon: 'none',
        title: '至少选择一件商品',
      })
    }else{
      wx.navigateTo({
        url: '../submitorders/submitorders?products='+id+'&counts='+count
      })
    }
  },
  //添加购物车
  addCartProduct:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    var user = app.getStorageSync('user_more', false);
    // 请求添加购物车
    wx.request({
      url: app.globalData.axgApi + '/cart-cart/addCartProduct',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        id,
        num:that.data.num
      },
      dataType: 'json',
      success(res) {
        console.log(res.data);
        if (res.data.code == 200){
          wx.showToast({
            icon: 'success',
            title: '添加购物车成功',
          })
        }
        that.getcartnum();
        that.hideModal1();
      }
    })
  },
  //获取购物车数量
  getcartnum:function(){
    let that = this;
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/cart-cart/getCartAmount',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {},
      dataType: 'json',
      success(res) {
        console.log(res.data);
        if (res.data.data.count){
          that.setData({
            cartnum: res.data.data.count
          })
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.showLoading({
      mask: true,
      title: '加载中...',
    });

    if (options.c_id){
      that.setData({
        c_id: options.c_id
      })
    }

    var url = app.getCurrentUrl(options);
    
    console.log(url);
    console.log(options);
    let id = options.id
    //判断是否登录
    app.checkLogin(url).then(function(){
    var user = app.getStorageSync('user_more', false);
    // 请求产品数据
    wx.request({
      url: app.globalData.axgApi + '/product-product/getProductDetails',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        id
      },
      dataType: 'json',
      success(res) {
        console.log(res.data);
        let data = res.data
        that.setData({
          product: data.data,
          osspath: data.osspath,
          imgUrls: data.data.product_image.map(item => data.osspath + item.picture_url),
          detailUrls: data.data.detail_image.map(item => data.osspath + item.picture_url)
        })
      }
    })

    });

    
  },

  /**
   * 减少购买数量
   */
  reduceNum(e){
    let num=this.data.num
    if(num>1)
      num--
    this.setData({
      num
    })
  },

  /**
   * 增加购买数量
   * @param e
   */
  addNum(e){
    let num=this.data.num
    if(num<this.data.product.stock)
      num++
    this.setData({
      num
    })
  },

  /**
   * 输入购买数量
   * @param e
   */
  inputNum(e){
    this.setData({
      num:e.detail.value
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
    this.getcartnum()
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
      path: 'pages/productsdetails/productsdetails?id=' + that.data.product.id + '&c_id='
             +that.data.c_id
    }
  }
})