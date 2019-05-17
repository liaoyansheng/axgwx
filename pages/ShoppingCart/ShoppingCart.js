// pages/ShoppingCart/ShoppingCart.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products:[],//购物车商品数据
    count:'',
    amount:'',
    sum:'0',//选择的商品数量
    totalPrice:'0',//选择的商品总价
    // checkProductsPri:[],//选中的商品价格数组
    checkProducts:'',//选中的商品数组
    checkProductNum: '',//选中的商品数量数组

    selectStatus: false, //底部全选
  },
  //底部全选商品
  selectAll:function(e){
    let that = this;
     console.log(e.detail.value);
    if (e.detail.value == '') {

      that.data.products.map(item => { item.isChecked = false })
      that.setData({
        selectStatus: false
      })

      let selected_product = this.data.products.filter(item => item.isChecked == true);
      let id_list = selected_product.map(item => item.id).join(',');
      let num_list = selected_product.map(item => item.num).join(',');
      console.log(id_list);
      console.log(num_list);
      let amount = 0;
      let sum = 0;
      for (let product of selected_product) {
        amount += product.group_price * product.num;
        sum += Number(product.num)
      };
      this.setData({
        totalPrice: amount.toFixed(2),
        sum: sum,
        checkProducts: id_list,
        checkProductNum: num_list
      });

    }else{

      that.data.products.map(item => { item.isChecked = true })
      that.setData({
        selectStatus: true
      })

      let selected_product = this.data.products.filter(item => item.isChecked == true);
      let id_list = selected_product.map(item => item.id).join(',');
      let num_list = selected_product.map(item => item.num).join(',');
      console.log(id_list);
      console.log(num_list);
      let amount = 0;
      let sum = 0;
      for (let product of selected_product) {
        amount += product.group_price * product.num;
        sum += Number(product.num)
      };
      this.setData({
        totalPrice: amount.toFixed(2),
        sum: sum,
        checkProducts: id_list,
        checkProductNum: num_list
      });

    }
    // console.log(that.data.products);
  },
//获取购物车数据
  getCartProducts:function(){
    let that = this;
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/cart-cart/getCartProducts',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {},
      dataType: 'json',
      success(res) {

        if (res.data.data != ''){

          let products = res.data.data
          products.map(item => {
            item.isChecked = true
          })
          that.setData({
            selectStatus:true,
            products: products,
            // getCartProducts: res.data.data,
            cart_id: res.data.data[0].cart_id,
            amount: res.data.amount.toFixed(2),
            count: res.data.count,
            osspath: app.globalData.osspath
          })
          console.log(that.data.products)
// 默认全选
          let selected_product = that.data.products.filter(item => item.isChecked == true);
          let id_list = selected_product.map(item => item.id).join(',');
          let num_list = selected_product.map(item => item.num).join(',');
          console.log(id_list);
          console.log(num_list);
          let amount = 0;
          let sum = 0;
          for (let product of selected_product) {
            amount += product.group_price * product.num;
            sum += Number(product.num)
          };
          that.setData({
            totalPrice: amount.toFixed(2),
            sum: sum,
            checkProducts: id_list,
            checkProductNum: num_list
          });
//默认全选
        }
        else{
          that.setData({
            products: res.data.data,
            selectStatus: false,
          })
        }

      }
    })
  },
  //选中商品
  checkProduct:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index
    // console.log(e.detail.value)
    let isChecked=e.detail.value==''?false:true
    console.log(isChecked)

    let key ='products['+index+'].isChecked'
    that.setData({
        [key]:isChecked
    })
    // console.log(that.data.products);
    let selected_product = this.data.products.filter(item => item.isChecked == true);
    let id_list = selected_product.map(item => item.id).join(',');
    let num_list = selected_product.map(item => item.num).join(',');
    console.log(id_list);
    console.log(num_list);
    let amount = 0;
    let sum = 0;
    for (let product of selected_product) {
      amount += product.group_price * product.num;
      sum += Number(product.num)
    };
    this.setData({
      totalPrice: amount.toFixed(2),
      sum:sum,
      checkProducts: id_list,
      checkProductNum: num_list
    });
  },
  //结算购物车
  Settlement:function(e){
    let that = this;
    let checkProducts = that.data.checkProducts.toString();
    let checkProductNum = that.data.checkProductNum.toString();
    if (checkProducts != '' && checkProductNum != ''){
      wx.navigateTo({
        url: '../submitorders/submitorders?products=' + checkProducts + '&counts=' + checkProductNum + '&g_type=' + 1
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: '请至少选择一件商品！',
      })
    }

  },
  //删除购物车商品
  delete:function(e){
    let that = this;
    let checkProducts = that.data.checkProducts;
    if (checkProducts != ''){
      var user = app.getStorageSync('user_more', false);
      wx.request({
        url: app.globalData.axgApi + '/cart-cart/deleteCartProduct',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + user.sessionid
        },
        data: {
          cart_id: that.data.cart_id,
          id_list:checkProducts
        },
        dataType: 'json',
        success(res) {
          console.log(res.data);
          wx.showToast({
            icon: 'none',
            title: '删除成功！',
          })
          that.setData({
            totalPrice: 0,
            sum: 0,
            checkProducts: '',
            checkProductNum: '',
            selectStatus:false
          });
          that.getCartProducts();

        }
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: '请选择商品！',
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
    // this.getCartProducts();
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
    this.getCartProducts();
    this.getcartnum();


    if (that.data.products) {
      that.setData({
        sum: '0',
        totalPrice: '0',
        checkProducts: ''
      })
    }


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

  },
  //增加商品数量
  addNum:function(e){
    let cart_id = e.target.dataset.cart_id
    let id = e.target.dataset.id
    let num = e.target.dataset.num
    num++
    let that = this;
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/cart-cart/updateProductNum',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        cart_id,
        id,
        num
      },
      dataType: 'json',
      success(res) {
        console.log(res.data)
        if (res.data.code == 200){
          that.getCartProducts();
        }
      }
    })
  },
  //减少商品数量
  reduceNum: function (e) {
    let cart_id = e.target.dataset.cart_id
    let id = e.target.dataset.id
    let num = e.target.dataset.num
    num--
    let that = this;
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/cart-cart/updateProductNum',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        cart_id,
        id,
        num
      },
      dataType: 'json',
      success(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          that.getCartProducts();
        }
      }
    })
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
          cartnum: res.data.data.count.toString()
        })
        wx.setTabBarBadge({
          index: 1,
          text: that.data.cartnum
        })
        console.log(that.data.cartnum);
      }
    })

  },


})