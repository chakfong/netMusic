// pages/music/comment/comment.js
var app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicId: null,
		playListId:null,
    isPlayListComment: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.playListId) {
      util.setCommentData(this, options.playListId)
      this.data.isPlayListComment = true;
      this.data.playListId = options.playListId
    } else {
			this.data.isPlayListComment=false;
			this.data.musicId=options.musicId;
      var commentData = app.globalData.commentData;
      this.setData({
        commentData: commentData
      })

    }
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
    this.innerAudioContext = app.globalData.innerAudioContext;
    this.innerAudioContext.onEnded(() => {
      util.nextSong(this);
    })
    util.dataRefresh(this);
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
    util.loadMoreComment(this, this.data.isPlayListComment?this.data.playListId:this.data.musicId, this.data.isPlayListComment);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})