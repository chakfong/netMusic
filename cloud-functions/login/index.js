'use strict';
const bigInt = require("bigInt.js");
const cry = require('crypto-js');
var http = require('https');

var cookie = null;
var cplt = null;
var mrq = null;
var user = null;
var phone =null;
var password=null;
const cloud = require('wx-server-sdk');
cloud.init();
var jsessionid = createRandomString("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ/+", 176) + ':' + (new Date).getTime();
var nuid = createRandomString('0123456789abcdefghijklmnopqrstuvwxyz', 32);
var cookieHead = "JSESSIONID-WYYY=" + jsessionid + ";_iuqxldmzr_=32; _ntes_nnid=" + nuid + ',' + (new Date).getTime() + "; _ntes_nuid=" + nuid;

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

function save() {

  const db = cloud.database();
		db.collection('login').add({
			data: {
				cookie: cookie,
				cplt: cplt,
				_id: user
			}
		});
		db.collection('login').doc(user).update({
			data:{
				cookie:cookie
			}
		})
}

function ApiRequest() {
  var Text = JSON.stringify({
    phone: phone,
    password: password,
    rememberLogin: "true"
  });
  var pubKey = "010001";
  var modulus = "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7";
  var secKeys = createSecretKey(16);
  var secKey = cry.enc.Utf8.parse(secKeys);
  var iv = cry.enc.Utf8.parse("0102030405060708");
  var nonce = cry.enc.Utf8.parse("0CoJUm6Qyw8W8jud");
  var et1 = cry.AES.encrypt(Text, nonce, {
    iv: iv,
    mode: cry.mode.CBC,
    padding: cry.pad.Pkcs7
  });
  const encText = cry.AES.encrypt(et1.toString(), secKey, {
    iv: iv,
    mode: cry.mode.CBC,
    padding: cry.pad.Pkcs7
  });
  var presk = secKeys.split('').reverse();
  var pp = "";
  for (var p in presk) {
    pp = pp.concat(presk[p].charCodeAt().toString(16));
  }
  var sk = bigInt(pp, 16);
  var pk = bigInt(pubKey, 16);
  var m = bigInt(modulus, 16);
  var k = sk.modPow(pk, m).toString(16);
  while (k.length < 256) {
    k = "0" + k;
  }
  var musicReq = '';
  // cplt = "1";
  var req = http.request({
    hostname: 'music.163.com',
    method: "POST",
    path: "/weapi/login/cellphone",
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'http://music.163.com',
      'Host': 'music.163.com',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/602.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/602.1'
    }
  }, function(res) {
    cplt = "2";
    res.on('error', function(err) {
      cplt = "error";
      return;
    });
    res.setEncoding('utf8');
    if (res.statusCode != 200) {
      cplt = "!200";
      return;
    } else {
      res.on('data', function(chunk) {
        musicReq += chunk;
        mrq = musicReq;
      })
      res.on('end', function() {
        if (musicReq == '') {
          cplt = "3";
          return;
        }
        if (res.headers['set-cookie']) {
          cookie = cookieHead + ';' + res.headers['set-cookie'];
          cplt = "4";
          save();
          return;
        }
        // response.send(musicReq);
      })
    }
  });
  req.write('params=' + encText.toString() + '&encSecKey=' + k);
  req.end();
}

exports.main = (event, context, callFunction) => {
  user = cloud.getWXContext().OPENID;
	phone=event.phone;
	password=event.password;

  ApiRequest();
  return {
    cookie,
    cplt,
    mrq
  };

};