let app=getApp()

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

    activity:{},
    osspath:'',
    count: 0, //商品数量
    amount:0,

    pruduct_list:[],
    pagesize: 20,//页数
    pageno: 1,//页码
    pageStatus: true,//默认是可以正常翻页
  },
//跳转首页
  toindex:function(){
    wx.showLoading({
      title: '加载中',
    })
    wx:wx.switchTab({
      url: '../index/index',
      success: function(res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      },
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
    let activity_id = options.id;//活动ID
    let c_id = options.c_id;//小区ID

    let that = this
    var user = app.getStorageSync('user_more', false);

    that.setData({
      activity_id: activity_id,
      c_id:c_id
    })
    //判断是否登录
    var url = app.getCurrentUrl(options);
    app.checkLogin(url).then(function () {
    // 请求数据
    wx.request({
      url:app.globalData.axgApi+'/activity-activity/getActivityDetails',
      method:'POST',
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data:{
        id:activity_id,
        c_id
      },
      dataType:'json',
      success(res){
        console.log(res.data.data.product_list);
        let activity=res.data.data
        let product_list=activity.product_list.map(item=>{
          item.num=0
          return item
        })
        that.setData({
            activity,
            product_list,
            osspath:res.data.osspath
        })
        //console.log(that.data.activity)
      }
    })
    });
    // 增加观看人数
    wx.request({
      url:app.globalData.axgApi+'/activity-activity/addVisitCount',
      method:'POST',
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data:{
        activity_id
      },
      dataType:'json',
      success(res){
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
    var user = app.getStorageSync('user_more', false);	

    that.data.pageno++;//搜索的时候初始化页码
    console.log('页码' + that.data.pageno);
    if (that.data.pageStatus) {
      that.data.pageStatus = true;
      wx.showLoading({
        title: '加载中...',
      })
      // 请求数据
      wx.request({
        url: app.globalData.axgApi + '/activity-activity/getActivityDetails',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + user.sessionid
        },
        data: {
          id: that.data.activity_id,
          c_id: that.data.c_id,
          pagesize: that.data.pagesize,
          pageno: that.data.pageno,
        },
        dataType: 'json',
        success(res) {

          wx.hideLoading();

          console.log(res.data.data.product_list)
          if (res.data.data.product_list.length > 0) {

            let product_list = res.data.data.product_list.map(item => {
              item.num = 0
              return item
            })
            let product_listData = that.data.product_list.concat(product_list);
            that.setData({
              product_list: product_listData
            })

          } else {
            wx.showToast({ title: '已经到底了哦！', icon: 'none', duration: 2000 });
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
      wx.showToast({ title: '更多活动产品持续上新中...', icon: 'none', duration: 2000 });
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.activity.title + '--安心购',
      desc: '安心购：大型社区团购平台，精选特卖、全城最低价商品，快乐抢购吧！',
      path: 'pages/activitydetails/activitydetails?id=' + that.data.activity_id +'&c_id='+that.data.c_id
    }
  },

  /**
   * 跳转到产品详情页面
   * @param e
   */
  toProductDetails(e) {
    let that = this;
    let activity_id = that.data.activity_id;
    let id=e.currentTarget.dataset.id;
    let status=e.currentTarget.dataset.status;
    if(status==2){
      wx.navigateTo({
        url: '../productsdetails/productsdetails?id=' + id + '&c_id='+ that.data.c_id +'&activity_id=' + activity_id,
      })
    } else if (status == 1){
      wx.showToast({
        icon: 'none',
        title: '该商品已下线！',
      })
    }
  },
  /**
   * 减少购买数量
   */
  reduceNum(e) {
    let num=e.target.dataset.num
    let index=e.target.dataset.index
    let count=this.data.count
    if (num > 0){
      num--
      count--
    }
    e.target.dataset.num=num
    let key='product_list['+index+'].num'
    this.setData({
      [key]:num,
      count
    })
    console.log(this.data.product_list);

    let amount=0
    for(let product of this.data.product_list){
      amount+=product.group_price*product.num
    }
    this.setData({
      amount:amount.toFixed(2)
    })
  },

  /**
   * 增加购买数量
   * @param e
   */
  addNum(e) {
    let num=e.target.dataset.num
    let index=e.target.dataset.index
    num++
    e.target.dataset.num=num
    let key='product_list['+index+'].num'
    let count= ++this.data.count
    this.setData({
      [key]:num,
      count
    })
    console.log(this.data.product_list);

    let amount=0
    for(let product of this.data.product_list){
      amount+=product.group_price*product.num
    }
    this.setData({
      amount:amount.toFixed(2)
    })
  },
  inputNum(e){
    let index=e.target.dataset.index
    let current_num=e.target.dataset.num
    let num=e.detail.value
    e.target.dataset.num=num
    let diff=num-current_num
    let count = this.data.count+diff
    let key='product_list['+index+'].num'
    this.setData({
      [key]:num,
      count
    })

    let amount=0
    for(let product of this.data.product_list){
      amount+=product.group_price*product.num
    }
    this.setData({
      amount:amount.toFixed(2)
    })
  },
  //立即购买
  buybtn:function(){
    let activity_id = this.data.activity_id;
    let selected_product=this.data.product_list.filter(item => item.num>0)
    let id_list=selected_product.map(item => item.id).join(',')
    let num_list=selected_product.map(item => item.num).join(',')
    if (this.data.count==0){
      wx.showToast({
        icon: 'none',
        title: '请选择至少一件商品',
      })
    }else{
      wx.navigateTo({
        url: '../submitorders/submitorders?products=' + id_list + '&counts=' + num_list + '&activity_id='+activity_id
      })
    }
  }


})