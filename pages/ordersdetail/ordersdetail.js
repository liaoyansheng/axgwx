// pages/ordersdetail/ordersdetail.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let order_number = options.id;
    console.log(order_number);
    // 请求订单数据
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/order-order/getOrderDetails',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        order_number: order_number
      },
      dataType: 'json',
      success(res) {

        let order=res.data.data
        order.products=JSON.parse(order.products)
        console.log(order.products)

        that.setData({
          roderdetail: order,
          osspath: app.globalData.osspath
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  // 该页面暂时不给分享
  // onShareAppMessage: function () {

  // }
})