// pages/chooseactivity/chooseactivity.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_id:'',//小区id
    selectStatus: false,  //底部全选
    OtherActivitylist:'', //其他活动列表
    osspath:'',
    CheckActivitylistlist:[],//选中活动表
    num:0,//选择活动数
  },
  //选择单个活动
  act_check:function(e){
    let id = e.currentTarget.dataset.id;
    console.log(id);
    // console.log(e.detail.value);
    if (e.detail.value == '') {

      let index = this.data.CheckActivitylistlist.indexOf(id);
      this.data.CheckActivitylistlist.splice(index, 1);
      console.log("取消选中");
      console.log(this.data.CheckActivitylistlist);
      console.log(this.data.CheckActivitylistlist.length)
      this.setData({
        num: this.data.CheckActivitylistlist.length
      })

    } else {
      
      this.data.CheckActivitylistlist.push(id)
      console.log(this.data.CheckActivitylistlist);
      console.log("选中");
      console.log(this.data.CheckActivitylistlist.length)
      this.setData({
        num: this.data.CheckActivitylistlist.length
      })

    }

  },
  //确认
  confirm:function(){
    let that = this;
    var user = app.getStorageSync('user_more', false);
    let checkArray = this.data.CheckActivitylistlist.toString();
    console.log(checkArray);
    if (checkArray.length > 0){
      wx.request({
        url: app.globalData.axgApi + '/activity-activity/addCommunityActivity',
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + user.sessionid
        },
        data: {
          community_id: that.data.c_id,
          activity_list: checkArray,
        },
        dataType: 'json',
        success(res) {
          console.log(res.data);
          wx.showToast({
            icon: 'success',
            title: res.data.msg,
          }); 

          setTimeout(function () {
            wx.showLoading({
              title: '成功跳转中',
            })
          }, 1000)
          console.log(that.data.c_id)
          setTimeout(function () {
            wx.navigateTo({
              url: '../activityshare/activityshare?c_id=' + that.data.c_id,
            })
          }, 2000)
        }
      })
    } else if (checkArray.length == 0){
      wx.showToast({
        icon: 'none',
        title: '未选择任何活动',
      }); 
      wx.navigateTo({
        url: '../activityshare/activityshare?c_id=' + that.data.c_id,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let c_id = options.c_id;
    console.log(options.c_id);

    that.setData({
      osspath: app.globalData.osspath,
      c_id: c_id
    })
    
    var user = app.getStorageSync('user_more', false);
    wx.request({
      url: app.globalData.axgApi + '/activity-activity/getCommunityOtherActivity',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + user.sessionid
      },
      data: {
        c_id: c_id
      },
      dataType: 'json',
      success(res) {
        that.setData({
          OtherActivitylist: res.data.data
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
    wx.hideLoading()
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

  }
})