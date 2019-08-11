//index.js
//获取应用实例
const app = getApp()
const md5 = require('../../utils/md5.js');
Page({
  data: {
    motto: 'Hello World',
    phone: null,
		pwd:null,
    jump: 30,
    jumpOut: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.redirectTo({
      url: '../music/music'
    })
  },
  onLoad: function() {

  },
  login: function() {
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return;
    }
    if (!this.data.pwd) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return;
    }
    wx.cloud.init();

    //登录网易云音乐
    this.logintest();
    this.data.jump = 30;
    this.data.jumpOut = false;
  },
  logintest: function() {
    wx.showToast({
      title: '登录中...',
      icon: 'loading',
    })
    var that = this;
    setTimeout(function() {
      wx.cloud.callFunction({
        // 云函数名称
        name: 'login',
        // 传给云函数的参数
        data: {
          phone: that.data.phone,
          password: that.data.pwd
        },
        success(res) {
          console.log("code:" + res.result.cplt + " 剩余尝试次数:" + that.data.jump)
          console.log(res);
          var mrq = JSON.parse(res.result.mrq);
          if (mrq && mrq.code != 200) {
            that.data.jumpOut = true;
            wx.showToast({
              title: '密码错误',
              icon: 'none'
            })
          }
          if (res.result.cplt == 4) {
            that.data.jumpOut = true;
            console.log(res)
            app.globalData.cookie = res.result.cookie;
						app.globalData.mrq=mrq;
            wx.hideToast();
						app.globalData.isLogin=true;
            wx.redirectTo({
              url: '../music/music'
            })
          }
          if (that.data.jump > 0 && !that.data.jumpOut)
            that.logintest(--that.data.jump);
        },
        fail: console.error
      });
    }, 50)
  },
  textinput: function(event) {
    var type = event.currentTarget.dataset.type;
    if (type == 1) {
      this.setData({
        phone: event.detail.value
      })
    } else {
      this.setData({
        pwd: md5.hexMD5(event.detail.value)
      })
    }
  },
})