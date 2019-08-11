// pages/music/more-music/more-music.js
var util = require("../../../utils/util.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var category = options.category;
    this.data.navigateTitle = category;
    wx.showNavigationBarLoading();
    var url = "";
    if (category == "我的歌单") {
      // musicLists[{title,coverageUrl,musicListId},...]
      var playlist = app.globalData.playlist;
      var musicLists = [];
      for (var idx in playlist) {
        if (playlist[idx].userId != app.globalData.mrq.account.id)
          continue;
        var title = playlist[idx].name;
        var coverageUrl = playlist[idx].coverImgUrl
        var musicListId = playlist[idx].id;
        var temp = {
          title: title,
          coverageUrl: coverageUrl,
          musicListId: musicListId
        }
        musicLists.push(temp);
      }
      this.setData({
        musicLists: musicLists
      });
      wx.hideNavigationBarLoading();
      wx.setNavigationBarTitle({
        title: this.data.navigateTitle
      });
      return;
    } else if (category == "收藏歌单") {
			var playlist = app.globalData.playlist;
			var musicLists = [];
			for (var idx in playlist) {
				if (playlist[idx].userId == app.globalData.mrq.account.id)
					continue;
				var title = playlist[idx].name;
				var coverageUrl = playlist[idx].coverImgUrl
				var musicListId = playlist[idx].id;
				var temp = {
					title: title,
					coverageUrl: coverageUrl,
					musicListId: musicListId
				}
				musicLists.push(temp);
			}
			this.setData({
				musicLists: musicLists
			});
			wx.hideNavigationBarLoading();
			wx.setNavigationBarTitle({
				title: this.data.navigateTitle
			});
			return;
    } else if (category != "热门歌单") {
			
			// var highQualitySongList = app.globalData.musicBase + "/songList/highQuality?cat=全部&pageSize=6&page=0";
			// var hotSongList = app.globalData.musicBase + "/songList/hot?cat=全部&pageSize=6&page=0";

			url = app.globalData.musicBase + "/songList/highQuality?cat=全部&pageSize=50&page=0";
    } else {
			url = app.globalData.musicBase + "/songList/hot?cat=全部&pageSize=20&page=50";
    }
    // this.data.requestUrl = url.substring(0, url.length - 8);
    util.http(url, this.processMusicData);

  },
  processMusicData: function(data) {
    var data = data.data;
    // if (this.data.navigateTitle != "热门歌单") {
    //   data = data.playlists;
    // }
    var musicLists = [];
    for (var idx in data) {
      var subject = data[idx];
      var title = subject.title;
      if (title == null) title = subject.name;
      var temp = {
        title: title,
        coverageUrl: subject.coverImgUrl,
        musicListId: subject.id
      }
      musicLists.push(temp)
    }
    this.setData({
      musicLists: musicLists
    });
    wx.hideNavigationBarLoading();
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    });
  },
  onMusicTap: function(event) {
    var musicListId = event.currentTarget.dataset.musicId;
    wx.navigateTo({
      url: "../musicList-detail/musicList-detail?id=" + musicListId
    })
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
      url: '../music-detail/music-detail',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // onReachBottom: function(event) {
  //   var totalCount = this.data.musicLists.length;
  //   //拼接下一组数据的URL
  //   var nextUrl = this.data.requestUrl +
  //     "offset=" + totalCount + "&limit=20";
  //   util.http(nextUrl, this.processMusicData)
  //   //显示loading状态
  //   wx.showNavigationBarLoading();
  // },
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
    this.innerAudioContext.offEnded();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})