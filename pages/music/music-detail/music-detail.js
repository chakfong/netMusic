// pages/music/music-detail/music-detail.js
var app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: null,
    max: null,
		playingTimeFormat:"00:00",
		maxTimeFormat:"00:00",
		commentCount:0,
		subscribedCount: " "
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.innerAudioContext = app.globalData.innerAudioContext;
    this.innerAudioContext.src = app.globalData.playingUrl;
    this.innerAudioContext.play();
		app.globalData.isPlaying=true;
		this.setData({
			isPlaying:true
		})
		
  },
  onShow: function() {
		this.innerAudioContext=app.globalData.innerAudioContext;
		this.innerAudioContext.onTimeUpdate(() => {
			this.setData({
				playingTimeFormat: util.formatSongTime(app.globalData.innerAudioContext.currentTime),
				maxTimeFormat: util.formatSongTime(this.data.playingTime),
				playingCurrentTime: app.globalData.innerAudioContext.currentTime
			})
		})
		this.innerAudioContext.onEnded(() => {
			util.nextSong(this);
		})
    util.dataRefresh(this);
		util.setCommentData(this);
  },
	
  change: function(event) {
    this.innerAudioContext.seek(event.detail.value);
		this.setData({
			playingTimeFormat: util.formatSongTime(event.detail.value),
		})
  },
  audioPlay: function() {
    this.innerAudioContext.play();
  },
  audioPause: function() {
    this.innerAudioContext.pause();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
		this.innerAudioContext.offEnded();
		this.innerAudioContext.offTimeUpdate();
  },
	prevSongTap:function(){
		util.prevSong(this);
		util.setCommentData(this);
	},
	nextSongTap: function () {
		util.nextSong(this);
		util.setCommentData(this);
	},
	onCommentsTap: function (event) {
		var musicId = event.currentTarget.dataset.musicId;
		wx.navigateTo({
			url: '../comment/comment?musicId=' + musicId,
		})
	},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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