// pages/music/music.js
var app = getApp();
var util = require("../../utils/util.js");
var bigInt = require("../../utils/bigInt.js");
const cry = require('crypto-js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    highQualitySongList: {},
    hotSongList: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {},
    cookie: null,
    jump: 80,
    jumpOut: false,
    isLogin: false,
    myAvatarImg: null,
    nickname: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      isLogin: app.globalData.isLogin,
      myAvatarImg: app.globalData.mrq.profile.avatarUrl,
      nickname: app.globalData.mrq.profile.nickname
    })

		var highQualitySongList = app.globalData.musicBase + "/songList/highQuality?cat=全部&pageSize=6&page=0";
		var hotSongList = app.globalData.musicBase + "/songList/hot?cat=全部&pageSize=6&page=0";
    wx.showNavigationBarLoading();
    this.getMusicListData(highQualitySongList, "highQualitySongList", "精品歌单");
    this.getMusicListData(hotSongList, "hotSongList", "热门歌单");

  },
  getMusicListData: function(url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function(res) {
        that.processMusicData(res.data, settedKey, categoryTitle)
      },
      fail: function(error) {
        // fail
        console.log(error)
      }
    })
  },
  processMusicData: function(musicListJson, settedKey,
    categoryTitle) {
    var musicLists = [];
    var playlists = musicListJson.data;
    // if (settedKey != "hotSongList") {
    //   playlists = playlists.playlists;
    // }
    // if (settedKey == "highQualitySongList") {
    //   playlists = playlists.playlists;
    // }
		if(settedKey=="searchResult"){
			playlists=playlists.songs;
		}
    for (var idx in playlists) {
      var subject = playlists[idx];
      var title = subject.title;
      if (title == null) title = subject.name;
      if (settedKey == "searchResult") {
        var temp = {
          title: title,
          coverageUrl: subject.al.picUrl,
          musicListId: subject.al.id,
          isSong: true,
          songDetail: {
            id: subject.id,
            name: subject.name,
            singer: subject.ar[0].name,
						pic: subject.al.picUrl,
            lrc: subject.lrc,
						url: "https://v1.itooi.cn/netease/url?id="+subject.id,
            time: subject.dt/1000
          }
        }
      } else {
        var temp = {
          title: title,
          coverageUrl: subject.coverImgUrl,
          musicListId: subject.id,
          isSong: false
        }

      }
      musicLists.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      musicLists: musicLists
    }
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  },
  onMusicTap: function(event) {
    var musicListId = event.currentTarget.dataset.musicId;
    var isSong = event.currentTarget.dataset.type;

    if (!isSong) {
      wx.navigateTo({
        url: "musicList-detail/musicList-detail?id=" + musicListId
      })
    } else {
      var songs = this.data.searchResult.musicLists
      var index = 0;
      for (var idx in songs) {
        if (songs[idx].musicListId == musicListId) {
          index = idx;
          break;
        }
      }
      var song = songs[index].songDetail;
      var songList = [song.id, song.name, song.singer, song.pic, song.lrc, song.url, song.time];
      app.globalData.songList = songList;
      app.globalData.playingId = song.id;
      app.globalData.playingName = song.name;
      app.globalData.playingSinger = song.singer;
      app.globalData.playingPic = song.pic;
      app.globalData.playingLrc = song.lrc;
      app.globalData.playingUrl = song.url;
      app.globalData.playingTime = song.time;
      wx.navigateTo({
        url: "music-detail/music-detail"
      })

    }


  },
  onMenuButton: function(event) {
    if (!app.globalData.isLogin) {
      wx.showLoading({
        title: '请先登录'
      })
      setTimeout(function() {
        wx.hideToast();
        wx.redirectTo({
          url: '../index/index'
        })
      }, 1000)
      return;
    }
    var type = event.currentTarget.dataset.type;
    if (type == 'likesong') {
      wx.cloud.init();
      if (app.globalData.playlist.length == 0)
        this.cloudRequest({
          uid: app.globalData.mrq.account.id,
          "offset": 0,
          "limit": 20,
          "csrf_token": ""
        }, "/weapi/user/playlist", function(mrq) {
          console.log(mrq);

          app.globalData.playlist = mrq.playlist;
          wx.navigateTo({
            url: 'musicList-detail/musicList-detail?id=' + app.globalData.playlist[0].id,
          })
        })
      else
        wx.navigateTo({
          url: 'musicList-detail/musicList-detail?id=' + app.globalData.playlist[0].id,
        })
    } else if (type == 'commended') {
      wx.cloud.init();
      if (app.globalData.playlist.length == 0)
        this.cloudRequest({
          uid: app.globalData.mrq.account.id,
          "offset": 0,
          "limit": 20,
          "csrf_token": ""
        }, "/weapi/user/playlist", function(mrq) {
          console.log(mrq);
          app.globalData.playlist = mrq.playlist;
          wx.navigateTo({
            url: 'more-music/more-music?category=收藏歌单',
          })
        })
      else
        wx.navigateTo({
          url: 'more-music/more-music?category=收藏歌单',
        })
    } else if (type == 'playlist') {
      wx.cloud.init();
      if (app.globalData.playlist.length == 0)
        this.cloudRequest({
          uid: app.globalData.mrq.account.id,
          "offset": 0,
          "limit": 20,
          "csrf_token": ""
        }, "/weapi/user/playlist", function(mrq) {
          console.log(mrq);
          app.globalData.playlist = mrq.playlist;
          wx.navigateTo({
            url: 'more-music/more-music?category=我的歌单',
          })
        })
      else
        wx.navigateTo({
          url: 'more-music/more-music?category=我的歌单',
        })
    }

  },
  cloudRequest: function(requestData, path, callback) {
    var that = this;
    wx.showToast({
      title: '获取中...',
      icon: 'loading',
    })
    setTimeout(function() {
      wx.cloud.callFunction({
        // 云函数名称
        name: 'playlist',
        // 传给云函数的参数
        data: {
          data: requestData,
          path: path,
          cookie: app.globalData.cookie
        },
        success(res) {
          var mrq = JSON.parse(res.result.mrq);
          if (mrq != null && mrq.code == 200) {
            wx.hideToast();
            callback(mrq);
            return;
          }
          that.cloudRequest({
            uid: app.globalData.mrq.account.id,
            "offset": 0,
            "limit": 20,
            "csrf_token": ""
          }, "/weapi/user/playlist", callback);
        },
        fail: console.error
      });
    }, 50);
  },
  onBindFocus: function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      inputValue: ''
    })
  },

  onBindConfirm: function(event) {
    var keyWord = event.detail.value;
    var searchUrl = app.globalData.musicBase +
			"/search?key=579621905&keyword=" + keyWord + "&type=song&pageSize=20&page=0";
    this.getMusicListData(searchUrl, "searchResult", "");

  },
  //音乐状态栏操作
  nextSongTap: function() {
    util.nextSong(this);
  },
  playTap: function() {
    this.innerAudioContext.src = app.globalData.playingUrl;
    app.globalData.innerAudioContext.play();
  },
  pauseTap: function() {
    app.globalData.innerAudioContext.pause();
  },
  showMusicDetailTap: function() {
    wx.navigateTo({
      url: 'music-detail/music-detail',
    })
  },
  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-music/more-music?category=' + category,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    util.dataRefresh(this);
    this.innerAudioContext = app.globalData.innerAudioContext;
    this.innerAudioContext.onEnded(() => {
      util.nextSong(this);
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.innerAudioContext.offEnded()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.innerAudioContext.offEnded();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})