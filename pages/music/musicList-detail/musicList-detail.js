// pages/music/music-detail/music-detail.js
var util = require('../../../utils/util.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var musicListId = options.id;
    var url = "https://music.163.com/api/playlist/detail?id=" + musicListId;
    wx.showNavigationBarLoading();
		var songsUrl = app.globalData.musicBase+"/songList?id=" + musicListId;
    //util.http(songsUrl, this.processSongsData);
    util.http(url, this.processMusicData);
    wx.hideNavigationBarLoading();
  },
  processSongsData: function(data) {
    var songs = data.data.tracks;
    this.setData({
      songs: songs
    })
  },
  processMusicData: function(data) {
		var songs = data.result.tracks;
		this.setData({
			songs: songs
		})
    var temp = {
      coverImgUrl: data.result.coverImgUrl,
      name: data.result.name,
      creater_avatarUrl: data.result.creator.avatarUrl,
      create_nickname: data.result.creator.nickname,
      expertTags: data.result.creator.expertTags,
      commentCount: data.result.commentCount,
      subscribedCount: data.result.subscribedCount,
      playCount: data.result.playCount,
      description: data.result.description,
      subscribed: data.result.subscribed,
			playListId:data.result.id
    }
    this.setData(temp);
    var barTitle = temp.name;
    if (temp.name.length >= 10) {
      barTitle = barTitle.substring(0, 10) + "..."
    }
    wx.setNavigationBarTitle({
      title: barTitle,
    })
  },
  onMusicTap: function(event) {
    var songList = [];
    var songs = this.data.songs;
    for (var idx in songs) {
      songList[idx] = [
			songs[idx].id,
			songs[idx].name, 
			songs[idx].artists[0].name,
			songs[idx].album.picUrl,
			songs[idx].lrc,
			// songs[idx].url,
			"https://v1.itooi.cn/netease/url?id="+songs[idx].id,
			songs[idx].duration/1000];
    }
    app.globalData.songList = songList;
    var song = event.currentTarget.dataset.song;
    app.globalData.playingId = song.id;
    app.globalData.playingName = song.name;
		app.globalData.playingSinger = song.artists[0].name;
    app.globalData.playingPic = song.album.picUrl;
    app.globalData.playingLrc = song.lrc;
		app.globalData.playingUrl = "https://v1.itooi.cn/netease/url?id="+song.id;
		app.globalData.playingTime = song.duration/1000;
    wx.navigateTo({
      url: "../music-detail/music-detail"
    })
  },
	nextSongTap:function(){
		util.nextSong(this);
	},
	playTap:function(){
		this.innerAudioContext.src = app.globalData.playingUrl;
		app.globalData.innerAudioContext.play();
	},
	pauseTap: function () {
		app.globalData.innerAudioContext.pause();
	},
	showMusicDetailTap:function(){
		wx.navigateTo({
			url: '../music-detail/music-detail',
		})
	},
	onCommentTap:function(){
		wx.navigateTo({
			url: '../comment/comment?playListId='+this.data.playListId,
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
		//音乐状态栏,监听音乐播放到结束时,下一首并刷新页面数据
    util.dataRefresh(this);
		this.innerAudioContext=app.globalData.innerAudioContext;
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