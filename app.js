//app.js
// var util=require("utils/util.js")
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    var innerAudioContext = wx.createInnerAudioContext();

    innerAudioContext.onPlay(() => {
      this.globalData.isPlaying = true;
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      page.setData({
        isPlaying: true
      })
      console.log('开始播放')
    })
    innerAudioContext.onPause(() => {
      this.globalData.isPlaying = false;
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      page.setData({
        isPlaying: false
      })
      console.log('暂停播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    this.globalData.innerAudioContext = innerAudioContext;
  },

  globalData: {
    isLogin: false,
    mrq: {
      account: {
        id: null
      },
      profile: {
        nickname: null,
        avatarUrl: null
      }
    },
    playlist: [],
    recommend: [],
    url: {
      playListCommentUrl: "https://music.163.com/api/v1/resource/comments/A_PL_0_",

    },
    userInfo: null,
    //musicBase: "https://api.itooi.cn/music/netease",
		musicBase: "https://v1.itooi.cn/netease",

    songList: ["423776955", "广东金融学院校歌-融通天下", "广金大树君/广金全体学生（反正不是我唱的）", "http://p1.music.126.net/ZAWSXdiDEhIw_YGWAXPLsg==/17677947951706004.jpg?param=400y400", "https://api.itooi.cn/music/netease/lrc?id=423776955&key=579621905", "https://api.itooi.cn/music/netease/url?id=423776955&key=579621905", 220],
    playingId: "423776955",
    playingName: "广东金融学院校歌-融通天下",
    playingSinger: "广金大树君/广金全体学生（反正不是我唱的）",
    playingPic: "http://p1.music.126.net/ZAWSXdiDEhIw_YGWAXPLsg==/17677947951706004.jpg?param=400y400",
    playingLrc: "https://api.itooi.cn/music/netease/lrc?id=423776955&key=579621905",
    playingUrl: "https://api.itooi.cn/music/netease/url?id=423776955&key=579621905",
    playingTime: 220,
    isPlaying: false,
  }
})