

//app.js
App({
  onLaunch: function () {
  },


  
  
  //封装发送请求
  sendRequest: function (options) {
    let me = this;
    options = Object.assign({
      url: '',
      data: {},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json'
    }, options);
    //参数处理
    options.data = Object.assign({ little_id: me.acc_little, acc_little: me.acc_little }, options.data);
    return new Promise(function (resolve, reject) {
      wx.request({
        url: options.url,
        data: options.data,
        method: options.method,
        success: resolve,
        fail: reject,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      });
    });
  },

  //设置时效缓存

  setStorageSync: function (k, v) {
    var postfix = '_deadtime';
    wx.setStorageSync(k, v);
    var seconds = parseInt(3600*24*7);
    if (seconds > 0) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000 + seconds;
      wx.setStorageSync(k + postfix, timestamp + "")
    } else {
      wx.removeStorageSync(k + postfix)
    }
  },


  //读取缓存，若缓存不存在，返回def，若没有设置默认返回值，则返回undefined
  getStorageSync: function (k, def) {
    var postfix = '_deadtime';
    var deadtime = parseInt(wx.getStorageSync(k + postfix))
    if (deadtime) {
      if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
        wx.removeStorageSync(k);
        wx.removeStorageSync(k + postfix);
        if (def) { return def; } else { return; }
      }
    }
    var res = wx.getStorageSync(k);
    if (res) {
      return res;
    } else if (def) {
      return def;
    } else {
      return;
    }
  },

  //登录方法
  newlogin: function (c_id=0) {
    var me = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          let code = res.code;
          //根据code获取用户的基本信息，并登录
          wx.getUserInfo({
            withCredentials: true,
            success({ rawData, signature, encryptedData, iv, encryptData }) {

              let url = me.globalData.axgApi + "/user-user/login";
              var reqdata = {
                code: code,
                encryptedData: encryptedData,
                iv: iv,
                latitude: me.globalData.latitude,
                longitude: me.globalData.longitude,
                c_id: c_id,//目前写死一个小区id tony 20190221
                channel: me.globalData.channel,
              };
              me.sendRequest({ url: url, data: reqdata }).then(function (response) {
                if (response.data.code == 200) {
                  //登录成功，保存登录成功标志
                  me.setStorageSync('user_more', response.data.data);
                  me.globalData.islogin = true;
                  me.globalData.openid = response.data.data.openid;
                  resolve(response.data); //回调成功函数
                } else {
                  reject(response.data);  //回调失败函数
                }
              }, function (response) {
                //console.log(response);
                reject(response);  //回调失败函数
              }).catch((response) => {
                reject({
                  errCode: 301,
                  errMsg: '登陆接口调取失败，调取接口失败'
                })
              });
            },


            fail(res) {
              reject({
                errCode: 100,
                errMsg: '授权失败'
              })
            }
          });
        },
        fail: function (res) {
          reject(res);    //回调失败函数
        }
      });
    });
  },

  //检测是否登录
  checkLogin: function (url) {
    let me = this;
    // options = Object.assign({}, url);
    // console.log(e);

    return new Promise(function (resolve, reject) {
        //判断是否登录成功
        // let token = me.getAccToken();
        //console.log(token);
        //console.log(me.getUserInfo());
        var token = me.getStorageSync('user_more');

        if (token && token.USER != undefined) {
          wx.checkSession({
            success: function (res) {
              //session_key 未过期，并且在本生命周期一直有效
              resolve(res);  //回调成功函数
            },
            fail: function () {
              // session_key 已经失效，需要重新执行登录流程
              //去登录
              wx.redirectTo({
                url: '../login/login?url=' + url,
              })
            }
          });
        } else {
          //调整授权登录页面
          console.log(url);
          wx.redirectTo({
            url: '../login/login?url=' + url,
          })

          // me.newlogin().then(function (res) {
          //   resolve(res);  //回调成功函数
          // }, function (err) {
          //   reject(err);  //回调失败函数
          // });
        }
      
    });
  },

  //获取当前页面url
  getCurrentUrl:function(options){
    var pages = getCurrentPages();
    var previousPage = pages[pages.length - 1];
    var url = previousPage.route+"?";
    for (var key in options){
      url = url + key + "=" + options[key] + "&";
    }
    url = encodeURIComponent(url)
    return url;
  },

  getParam: function (url, param){
    if (url.indexOf("?") != -1) {
      var index = url.indexOf("?");
      var str = url.substr(index+1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        param[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
  },

  globalData: {
    userInfo: null,
    channel: '',
    latitude:'',
    longitude:'',
    axgApi:'https://testaxgwap.axfhouse.com',
    // axgApi: 'https://axgwap.axfhouse.com',
    islogin: false,
    osspath:'',
  }
})