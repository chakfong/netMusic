		const formatTime = date => {
		  const year = date.getFullYear()
		  const month = date.getMonth() + 1
		  const day = date.getDate()
		  const hour = date.getHours()
		  const minute = date.getMinutes()
		  const second = date.getSeconds()

		  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
		}

		const formatNumber = n => {
		  n = n.toString()
		  return n[1] ? n : '0' + n
		}

		function formatSongTime(time) {
		  var minute = Math.floor(time / 60);
		  time = Math.floor(time % 60);
		  if (minute < 10) minute = "0" + minute;
		  if (time < 10) time = "0" + time;
		  return minute + ":" + time;
		}
		/*
		 *根据客户端的时间信息得到发表评论的时间格式
		 *多少分钟前，多少小时前，然后是昨天，然后再是月日
		 * Para :
		 * recordTime - {float} 时间戳
		 * yearsFlag -{bool} 是否要年份
		 */
		function getDiffTime(recordTime, yearsFlag) {
		  if (recordTime) {
		    recordTime = new Date(parseFloat(recordTime) * 1000);
		    var minute = 1000 * 60,
		      hour = minute * 60,
		      day = hour * 24,
		      now = new Date(),
		      diff = now - recordTime;
		    var result = '';
		    if (diff < 0) {
		      return result;
		    }
		    var weekR = diff / (7 * day);
		    var dayC = diff / day;
		    var hourC = diff / hour;
		    var minC = diff / minute;
		    if (weekR >= 1) {
		      var formate = 'MM-dd hh:mm';
		      if (yearsFlag) {
		        formate = 'yyyy-MM-dd hh:mm';
		      }
		      return recordTime.format(formate);
		    } else if (dayC == 1 || (hourC < 24 && recordTime.getDate() != now.getDate())) {
		      result = '昨天' + recordTime.format('hh:mm');
		      return result;
		    } else if (dayC > 1) {
		      var formate = 'MM-dd hh:mm';
		      if (yearsFlag) {
		        formate = 'yyyy-MM-dd hh:mm';
		      }
		      return recordTime.format(formate);
		    } else if (hourC >= 1) {
		      result = parseInt(hourC) + '小时前';
		      return result;
		    } else if (minC >= 1) {
		      result = parseInt(minC) + '分钟前';
		      return result;
		    } else {
		      result = '刚刚';
		      return result;
		    }
		  }
		  return '';
		}

		/*
		 *拓展Date方法。得到格式化的日期形式
		 *date.format('yyyy-MM-dd')，date.format('yyyy/MM/dd'),date.format('yyyy.MM.dd')
		 *date.format('dd.MM.yy'), date.format('yyyy.dd.MM'), date.format('yyyy-MM-dd HH:mm')
		 *使用方法 如下：
		 *                       var date = new Date();
		 *                       var todayFormat = date.format('yyyy-MM-dd'); //结果为2015-2-3
		 *Parameters:
		 *format - {string} 目标格式 类似('yyyy-MM-dd')
		 *Returns - {string} 格式化后的日期 2015-2-3
		 *
		 */
		(function initTimeFormat() {
		  Date.prototype.format = function(format) {
		    var o = {
		      "M+": this.getMonth() + 1, //month
		      "d+": this.getDate(), //day
		      "h+": this.getHours(), //hour
		      "m+": this.getMinutes(), //minute
		      "s+": this.getSeconds(), //second
		      "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		      "S": this.getMilliseconds() //millisecond
		    }
		    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
		      (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		      if (new RegExp("(" + k + ")").test(format))
		        format = format.replace(RegExp.$1,
		          RegExp.$1.length == 1 ? o[k] :
		          ("00" + o[k]).substr(("" + o[k]).length));
		    return format;
		  };
		})()

		function http(url, callBack) {
		  wx.request({
		    url: url,
		    method: 'GET',
		    header: {
		      "content-type": "json"
		    },
		    success: function(res) {
		      callBack(res.data);
		    },
		    fail: function(error) {
		      console.log(error)
		    }
		  })
		}
		var app = getApp();
		var innerAudioContext = app.globalData.innerAudioContext;

		function nextSong(page) {
		  var songList = app.globalData.songList;
		  for (var idx in songList) {
		    if (songList[idx][0] == app.globalData.playingId) {
		      var i = (Number(idx) + 1) % songList.length;
		      innerAudioContext.src = songList[i][5];
		      innerAudioContext.play();
		      app.globalData.playingId = songList[i][0];
		      app.globalData.playingName = songList[i][1];
		      app.globalData.playingSinger = songList[i][2];
		      app.globalData.playingPic = songList[i][3];
		      app.globalData.playingLrc = songList[i][4];
		      app.globalData.playingUrl = songList[i][5];
		      app.globalData.playingTime = songList[i][6];
		      this.dataRefresh(page);
		      break;
		    }
		  }
		}

		function prevSong(page) {
		  var songList = app.globalData.songList;
		  for (var idx in songList) {
		    if (songList[idx][0] == app.globalData.playingId) {
		      var i = (Number(idx) + Number(songList.length) - 1) % songList.length;
		      console.log("i是" + i);
		      innerAudioContext.src = songList[i][5];
		      innerAudioContext.play();
		      app.globalData.playingId = songList[i][0];
		      app.globalData.playingName = songList[i][1];
		      app.globalData.playingSinger = songList[i][2];
		      app.globalData.playingPic = songList[i][3];
		      app.globalData.playingLrc = songList[i][4];
		      app.globalData.playingUrl = songList[i][5];
		      app.globalData.playingTime = songList[i][6];
		      this.dataRefresh(page);
		      break;
		    }
		  }
		}

		function dataRefresh(page) {
		  console.log("更新数据")
		  page.setData({
		    playingId: app.globalData.playingId,
		    playingName: app.globalData.playingName,
		    playingSinger: app.globalData.playingSinger,
		    playingPic: app.globalData.playingPic,
		    playingLrc: app.globalData.playingLrc,
		    playingUrl: app.globalData.playingUrl,
		    playingTime: app.globalData.playingTime,
		    playingCurrentTime: app.globalData.innerAudioContext.currentTime,
		    isPlaying: app.globalData.isPlaying
		  })
		}

		function setCommentData(page, playListId) {
		  //获取评论信息
		  if (playListId) {
		    var url = app.globalData.url.playListCommentUrl + playListId + "?offset=0&limit=20";
		  } else {
		    var url = "https://music.163.com/api/v1/resource/comments/R_SO_4_" + app.globalData.playingId + "?offset=0&limit=20";
		  }
		  var that = this;
		  this.http(url, function(data) {
		    app.globalData.commentData = data
		    var comments = data.comments;
		    for (var idx in comments) {
		      comments[idx].time = that.getDiffTime(comments[idx].time / 1000, true);
		    }
		    app.globalData.commentData.comments = comments;
		    page.setData({
		      musicId: app.globalData.playingId,
		      commentCount: app.globalData.commentData.total,
					commentData:app.globalData.commentData
		    })
		  });
		}

		function loadMoreComment(page, musicId, isPlayListComment) {
		  var url = null;
		  if (isPlayListComment) {
		    url = app.globalData.url.playListCommentUrl
		  } else {
		    url = "https://music.163.com/api/v1/resource/comments/R_SO_4_"
		  }
		  url = url + musicId + "?offset=" + app.globalData.commentData.comments.length + "&limit=20";
		  var that = this;
		  this.http(url, function(data) {
		    var comments = data.comments;
		    for (var idx in comments) {
		      comments[idx].time = that.getDiffTime(comments[idx].time / 1000, true);
		    }
		    app.globalData.commentData.comments =
		      app.globalData.commentData.comments.concat(comments)

		    page.setData({
		      commentData: app.globalData.commentData
		    })
		  });
		}

		function getCurrentPage() {
		  var pages = getCurrentPages() //获取加载的页面
		  var currentPage = pages[pages.length - 1] //获取当前页面的对象
		  return currentPage
		}

		function createSecretKey(size) {
		  var keys = "abcdef0123456789";
		  var key = "";
		  for (var i = 0; i < size; i++) {
		    var pos = Math.random() * keys.length;
		    pos = Math.floor(pos);
		    key = key + keys.charAt(pos)
		  }
		  return key;
		}

		function createRandomString(keys, size) {
		  var key = "";
		  for (var i = 0; i < size; i++) {
		    var pos = Math.random() * keys.length;
		    pos = Math.floor(pos);
		    key = key + keys.charAt(pos)
		  }
		  return key;
		}
		module.exports = {
		  formatTime: formatTime,
		  getDiffTime: getDiffTime,
		  http: http,
		  prevSong: prevSong,
		  nextSong: nextSong,
		  setCommentData: setCommentData,
		  loadMoreComment: loadMoreComment,
		  dataRefresh: dataRefresh,
		  formatSongTime: formatSongTime,
		  createSecretKey: createSecretKey,
		  createRandomString: createRandomString,

		}