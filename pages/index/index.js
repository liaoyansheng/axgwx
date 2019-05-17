let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',//是否有属于小区
    searchName:'',//搜索框值
    // banner数据
    autoplay: true,
    current: 0,
    interval: 3000,
    duration: 500,
    bannerlist: [],

    searchTip: [],//热搜索词

    products:[],
    osspath:'',
    activities:[],
    pagesize: 20,//页数
    pageno: 1,//页码
    pageStatus: true,//默认是可以正常翻页
  },
  //搜索框的值
  searchInput:function(e){
    let that = this;
    let searchName = e.detail.value;
    console.log(searchName);
    that.setData({
      searchName: searchName,
    })
  },
  //搜索方法
  searchBtn:function(){
    let that = this;
    that.data.pageno = 1;//搜索的时候初始化页码
    that.data.pageStatus = true;

    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/product-product/getIndexProduct',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        name: that.data.searchName,
      },
      dataType: 'json',
      success(res) {
        that.setData({
          products: res.data.data,
        })
        console.log(that.data.products);
      }
    })
  
  },
 //跳转到产品详情页面
  toProductDetails(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../productsdetails/productsdetails?id=' + id
    })
  },
//跳转活动详情
  toactivitydetails:function(e){
    let that = this;
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../activitydetails/activitydetails?id='+id+'&c_id='+that.data.type,
    })

  },
  //请求数据
  repdata:function(){
    let that = this
    var user = app.getStorageSync('user_more', false);
    var c_id = user.USER.c_id;
    // console.log(user.USER.c_id);
    that.setData({
      type: c_id
    })

    // 首页商品数据
    wx.request({
      url: app.globalData.axgApi + '/product-product/getIndexProduct',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {},
      dataType: 'json',
      success(res) {
        app.globalData.osspath = res.data.osspath;
        that.setData({
          products: res.data.data,
          osspath: res.data.osspath
        })
        console.log(that.data.products);
      }
    })

    if (c_id === '0') {
      // 游客首页数据
      // wx.request({
      //   url: app.globalData.axgApi + '/product-product/getIndexProduct',
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded',
      //     'Cookie': 'PHPSESSID=' + user.sessionid
      //   },
      //   data: {},
      //   dataType: 'json',
      //   success(res) {
      //     app.globalData.osspath = res.data.osspath;
      //     that.setData({
      //       products: res.data.data,
      //       osspath: res.data.osspath
      //     })
      //     console.log(that.data.products);
      //   }
      // })
      //首页游客轮播图
      wx.request({
        url: app.globalData.axgApi + '/banner-banner/getIndexBanner',
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
            bannerlist: res.data.data,
          })
          console.log(that.data.bannerlist);
        }
      })

    }
    else {

      // // 小区首页数据
      // wx.request({
      //   url: app.globalData.axgApi + '/activity-activity/getCommunityActivity',
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded',
      //     'Cookie': 'PHPSESSID=' + user.sessionid
      //   },
      //   data: {
      //     c_id: c_id
      //   },
      //   dataType: 'json',
      //   success(res) {
      //     console.log(res.data.data);
      //     app.globalData.osspath = res.data.osspath;
      //     that.setData({
      //       activities: res.data.data,
      //       osspath: res.data.osspath
      //     })
      //   }
      // })
      //小区首页轮播图
      wx.request({
        url: app.globalData.axgApi + '/banner-banner/getCommunityBanner',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + user.sessionid
        },
        data: {
          c_id: that.data.type
        },
        dataType: 'json',
        success(res) {
          that.setData({
            bannerlist: res.data.data,
          })
          console.log(that.data.bannerlist);
        }
      })
    }
  },
  //获取热词
  getHotWord:function(){
    let that = this;
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/product-product/getHotWord',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {},
      dataType: 'json',
      success(res) {
        console.log(res);
        that.setData({
          searchTip: JSON.parse(res.data.data)
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.c_id);
    wx.showLoading({
      title: '加载中',
    })
    var url = app.getCurrentUrl;
    console.log(url);
    let that = this
    var pages = getCurrentPages();//获取当前的页面栈，决定需要返回几层。
    // console.log(pages);
    // console.log(pages.length);
    //判断是否登录

    app.checkLogin().then(function(){
      that.repdata();
      that.getHotWord();
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
    let that = this;
    var user = app.getStorageSync('user_more', false);
    that.data.pageno++;//搜索的时候初始化页码
    console.log('页码' + that.data.pageno);
    // if (that.data.type === '0') {
      if (that.data.pageStatus) {
        that.data.pageStatus = true;
        wx.showLoading({
          title: '加载中...',
        })
        wx.request({
          url: app.globalData.axgApi + '/product-product/getIndexProduct',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': 'PHPSESSID=' + user.sessionid
          },
          data: {
            pagesize: that.data.pagesize,
            pageno: that.data.pageno,
            name: that.data.searchName,
          },
          dataType: 'json',
          success(res) {
            console.log(res.data.data);
            wx.hideLoading();
            if (res.data.data.length > 0) {
              let products = that.data.products.concat(res.data.data);
              that.setData(
                {
                  products: products,
                  pageStatus: true,
                }
              );
            }else{
              wx.showToast({ title: '更多商品持续上线中...', icon: 'none', duration: 2000 });
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
        wx.showToast({ title: '更多商品持续上线中...', icon: 'none', duration: 2000 });
      }
    // }else{
    //   //小区首页 
    //   if (that.data.pageStatus) {
    //     that.data.pageStatus = true;
    //     wx.showLoading({
    //       title: '加载中...',
    //     })
    //     wx.request({
    //       url: app.globalData.axgApi + '/product-product/getCommunityActivity',
    //       method: 'POST',
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded',
    //         'Cookie': 'PHPSESSID=' + user.sessionid
    //       },
    //       data: {
    //         c_id:that.data.type,
    //         pagesize: that.data.pagesize,
    //         pageno: that.data.pageno,
    //       },
    //       dataType: 'json',
    //       success(res) {
    //         wx.hideLoading();
    //         console.log(res.data);
    //         if (res.data.length > 0) {
    //           let activitiesData = that.data.activities.concat(res.data.data);
    //           that.setData({
    //             activities: activitiesData
    //           })
    //         } else {
    //           wx.showToast({ title: '更多活动上线中！', icon: 'none', duration: 2000 });
    //           that.data.pageStatus = false;
    //         }

    //       },
    //       fail: function (res) {
    //         wx.hideLoading();
    //         wx.showToast({ title: '系统繁忙...', icon: 'none', duration: 2000 });
    //         that.data.pageStatus = true;
    //       }
    //     })
    //   } else {
    //     wx.showToast({ title: '更多活动上线中！', icon: 'none', duration: 2000 });
    //   }
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '安心购-社区团购平台',
      desc: '安心购：大型社区团购平台，精选特卖、全城最低价商品，快乐抢购吧！',
      path: 'pages/index/index?c_id='+that.data.type
    }
  },

  // banner项 跳转指定页面
  towxappurl: function (e) {
    var wxappurl = e.currentTarget.dataset.url;
    if (wxappurl){
      wx.navigateTo({
        url: wxappurl,
        fail: function () {
        }
      })
    }
    
  },
  //获取购物车数量
  getcartnum: function () {
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
        that.setData({
          cartnum: res.data.data.count
        })
        wx.setTabBarBadge({
          index: 1,
          text: that.data.cartnum.toString()
        })
        console.log(that.data.cartnum);
      }
    })
    
  },
})