function getidd() {
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("=");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[2]);
		}
	}
	idd = strs[1].split("=")[0];
}

function getInfo(id) {

	api.showProgress({
		title : ' 加载中...',
		text : '请稍等...',
		modal : false
	})
	api.sendEvent({
		name : 'cancelDownload',
	});
	$api.rmStorage('play');

	api.getPrefs({
		key : 'mul'
	}, function(ret, err) {
		var Idd = ret.value
		api.ajax({
			url : musicUrl + Idd + houZhui,
			cache : true,
			dataType : 'json',
		}, function(ret, err) {
			if (ret) {
				var arr = ret.result.tracks;
				var myobj = eval(arr);
				bb = myobj[id].mp3Url;
				songName = myobj[id].name;
				artists = myobj[id].artists[0].name;
				albumpic = myobj[id].album.picUrl;
				songsId = myobj[id].id
				$api.setStorage('album', albumpic);
				//              var controler = $api.byId('controler1');
				//				$api.attr(controler, 'src', albumpic);
				//								songCache(bb)

				//               var controler = $api.byId('controler1');
				//				$api.attr(controler, 'src', albumpic);

				play(bb)
				api.setPrefs({
					key : 'songid2',
					value : songsId
				});
				getCache(albumpic)
				//给mini播放器数据
				api.sendEvent({
					name : 'min',
					extra : {
						artists : artists,
						name : songName,
						sid : songsId,
						apic : albumpic,
						songName : bb
					}
				});
				///////////////////////////////

				//////////////////

				//				var jia = 'jiaTitle()'
				//				api.execScript({
				//					name : 'slider',
				//					script : jia
				//				});
				$api.setStorage('idi', id);

				var music = {};
				music.name = songName;
				music.art = artists;
				music.url = bb;
				music.pic = albumpic;
				$api.setStorage('kee', music);
				var aa = $api.byId('title1');
				var bb = $api.byId('titleName')
				$api.text(aa, songName);
				$api.text(bb, artists);
				api.setPrefs({
					key : 'urll',
					value : bb
				});
				var uul = ''
				//播放模块
				//
			} else {
				api.alert({
					msg : ('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode)
				});
			};
		});
	});
}

function play(mp3) {
	var pdd = $api.byId('playe');
	var netAudio = api.require('audio');
	var pdd = $api.byId('playerIcon');
	var jsfun = 'stop()'

	api.execScript({
		name : "index",
		frameName : 'quan_index',
		script : jsfun
	});
	api.execScript({
		name : "index",
		frameName : 'tui_index',
		script : jsfun
	});

	netAudio.play({
		path : mp3
	}, function(ret, err) {
		api.hideProgress();
		var duration = ret.duration;
		var tii = duration * 10;
		var current = ret.current;
		var percent = (current / duration) * 100;
		var per = Math.round(percent);
		var complete = ret.complete;
		var slider = api.require('slider');

		var dur = formatSeconds(duration);
		var cur = formatSeconds(current);
		//		var jsfun1 = 'xunhuan1();';
		//		api.execScript({
		//			name: 'index',
		//
		//			script : jsfun1
		//		});

		strmiao = '<span class="s H-float-left   H-padding-horizontal-left-5 H-padding-vertical-top-10" style="font-size: 1.1rem; ">' + cur + '</span><input id="hua" type="range" class="H-range H-width-80-percent H-position-relative  H-border-radius-1 H-theme-font-color5"  value="' + per + '" > <span class="e H-float-right   H-padding-horizontal-right-5 H-padding-vertical-top-10" style="font-size: 1.1rem; ">' + dur + '</span> ';
		$api.byId('slider').innerHTML = strmiao;
		///锁屏播放

		audioCover(duration, songName, artists, per)
		//			}
		//		});
		$api.setStorage('bofang', 1);
		api.setPrefs({
			key : 'per',
			value : per
		});
		if (complete) {
			var PP = $api.getStorage('PlayAll');
			if (PP == 'a') {
				next();
				api.removePrefs({
					key : 'per'
				});
				//							$api.rmStorage('PlayAll')
			} else {
				var mp34 = $api.getStorage('path');
				play(mp34);
				api.removePrefs({
					key : 'per'
				});
				//							$api.rmStorage('PlayAll')
			}
		} else {
		}
	});
	$api.removeCls(pdd, 'icon-bofang');
	$api.addCls(pdd, 'icon-zanting');
}

function next() {
	stop()
	var i = $api.getStorage('idi');
	var len = $api.getStorage('lens');
	var nId = Number(i) + Number(1);
	$api.rmStorage('path');
	if (nId == len) {
		getInfo(0);
		api.removePrefs({
			key : 'per'
		});
	} else {
		getInfo(nId)
	}
}

function prev() {
	stop()
	var i = $api.getStorage('idi');
	var len = $api.getStorage('lens');
	$api.rmStorage('path');
	var bId = Number(i) - Number(1);
	if (bId == -1) {
		getInfo(0);
		api.removePrefs({
			key : 'per'
		});
		//		startProgress();
	} else {
		getInfo(bId)
	}
}

function getCache(pic) {
	api.imageCache({
		url : pic
	}, function(ret, err) {
		if (ret) {
			albumC = ret.url;
			$api.setStorage('uulr', albumC);
			api.setPrefs({
				key : 'apic',
				value : albumC
			});
		} else {
		}
	});
	$api.rmStorage('album')
}

function pause() {
	//	api.sendEvent({
	//		name : 'cancelDownload',
	//	});

	var pdd = $api.byId('playerIcon');
	$api.removeCls(pdd, 'icon-zanting');
	$api.addCls(pdd, 'icon-bofang');
	api.getPrefs({
		key : 'isPlaying'
	}, function(ret, err) {
		if (ret.value == 1) {
		}
	});
	var netAudio = api.require('audio');
	netAudio.pause();
}

function stop() {
	api.getPrefs({
		key : 'isPlaying'
	}, function(ret, err) {
		if (ret.value == 1) {
		}
	});
	var obj = api.require('audio');
	obj.stop();
}

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
	return currentdate;
}

function formatSeconds(value) {
	var theTime = parseInt(value);
	// 秒
	var theTime1 = 0;
	// 分
	var theTime2 = 0;
	// 小时 // alert(theTime);
	if (theTime > 60) {
		theTime1 = parseInt(theTime / 60);
		theTime = parseInt(theTime % 60);
		// alert(theTime1+"-"+theTime);
		if (theTime1 > 60) {
			theTime2 = parseInt(theTime1 / 60);
			theTime1 = parseInt(theTime1 % 60);
		}
	}
	var result = "" + parseInt(theTime) + "";
	if (result < 10) {
		var result = "0" + parseInt(theTime) + "";
		if (10 > theTime1 > 0) {
			result = "0" + parseInt(theTime1) + ":" + result;
		} else {
			result = "" + parseInt(theTime1) + ":" + result;
		}
		if (theTime2 > 0) {
			result = "" + parseInt(theTime2) + ":" + result;
		}
		return result;
	} else {
		if (10 > theTime1 > 0) {
			result = "0" + parseInt(theTime1) + ":" + result;
		} else {
			result = "" + parseInt(theTime1) + ":" + result;
		}
		if (theTime2 > 0) {
			result = "" + parseInt(theTime2) + ":" + result;
		}
		return result;
	}
}

function kai() {
	api.toast({
		msg : '正在开发中...'
	});
}

function quXiaoShouCang() {
	music = $api.getStorage('kee');
	var songName = music.name;

	api.getPrefs({
		key : 'user'
	}, function(ret, err) {
		user = ret.value
	});
	api.getPrefs({
		key : 'songid2'
	}, function(ret, err) {
		sidd = ret.value

		api.ajax({
			url : 'http://v7idc.com/m/quxiao.php',
			method : 'post',
			cache : false,
			timeout : 30,
			dataType : 'text',
			data : {
				values : {
					user : user,
					songName : songName,
					sid : sidd,

				}
			}
		}, function(ret, err) {
			if (ret == 1) {
				alert('成功')

			} else {
				alert('失败')
			}
		});
	});
}

function shouCang() {

	music = $api.getStorage('kee');
	var userIcon = $api.getStorage('usericon');

	var bb = music.url;
	var artists = music.art;
	var songName = music.name;
	var albumpic = music.pic;

	api.getPrefs({
		key : 'user'
	}, function(ret, err) {
		user = ret.value
	});
	api.getPrefs({
		key : 'songid2'
	}, function(ret, err) {
		var sid = ret.value
		api.ajax({
			url : hostUrl + '/mylist.php',
			method : 'post',
			cache : false,
			timeout : 30,
			dataType : 'text',
			data : {
				values : {
					sid : sid,
					username : user
				}
			}
		}, function(ret, err) {
			if (ret == 1) {

				api.ajax({
					url : shouUrl,
					method : 'post',
					cache : true,
					timeout : 30,
					dataType : 'json',
					data : {
						values : {
							mp3 : bb,
							artist : artists,
							title : songName,
							poster : albumpic,
							user : user,
							background : albumpic,
							cover : albumpic,
							//							usericon: userIcon
						}
					}
				}, function(ret, err) {
					//coding...
				});

				api.toast({
					msg : '收藏成功'
				});
			} else if (ret == 2) {

				api.confirm({
					title : '取消收藏',
					msg : '亲，要取消吗？',
					buttons : ['确定', '取消']
				}, function(ret, err) {
					if (ret.buttonIndex == 1) {
						quXiaoShouCang()
					} else {

					}
				});

			} else {
				api.toast({
					msg : '收藏失败'
				});
			}
			//coding...
		});
		////////////////
	});
}

/**
 * 获取头像
 * 周枫
 * 2016.1.16
 */
function getPicture() {
	isOnLineStatus(function(is_true, line_type) {
		if (is_true) {
			if (line_type == 'wifi' || line_type == '4g') {
				api.confirm({
					title : "提示",
					msg : "您需要如何选择自己的头像？",
					buttons : ["现在照", "相册选", "取消"]
				}, function(ret, err) {
					//定义图片来源类型
					var sourceType;
					if (1 == ret.buttonIndex) {/* 打开相机*/
						sourceType = "camera";
						openPicture(sourceType);
					} else if (2 == ret.buttonIndex) {
						sourceType = "album";
						openPicture(sourceType);
					} else {
						return;
					}
				});
			} else {
				api.confirm({
					title : "提示",
					msg : "您当前正在使用" + line_type + "网络，建议您在wifi网络下使用，是否继续？",
					buttons : ["继续", "取消"]
				}, function(ret, err) {
					var sourceType;
					if (1 == ret.buttonIndex) {
						api.confirm({
							title : "提示",
							msg : "您需要如何选择自己的头像？",
							buttons : ["现在照", "相册选", "取消"]
						}, function(ret, err) {
							//定义图片来源类型
							var sourceType;
							if (1 == ret.buttonIndex) {/* 打开相机*/
								sourceType = "camera";
								openPicture(sourceType);
							} else if (2 == ret.buttonIndex) {
								sourceType = "album";
								openPicture(sourceType);
							} else {
								return;
							}
						});
					} else {
						return;
					}
				});
			}
		} else {
			api.toast({
				msg : '请连接网络后使用当前功能~'
			});
		}
	});
}

// 选取图片

function openPicture(sourceType) {
	isOnLineStatus(function(is_true, line_type) {
		var q = 100;
		if (line_type == 'wifi') {
			q = 100;
		}
		//获取一张图片
		api.getPicture({
			sourceType : sourceType,
			encodingType : 'png',
			mediaValue : 'pic',
			//返回数据类型，指定返回图片地址或图片经过base64编码后的字符串
			//base64:指定返回数据为base64编码后内容,url:指定返回数据为选取的图片地址
			destinationType : 'url',
			//是否可以选择图片后进行编辑，支持iOS及部分安卓手机
			allowEdit : false,
			//图片质量，只针对jpg格式图片（0-100整数）,默认值：50
			quality : q,
			//                targetWidth : 100,
			//                targetHeight : 1280,
			saveToPhotoAlbum : true
		}, function(ret, err) {
			if (ret) {
				/*
				 * data:"",                //图片路径
				 base64Data:"",          //base64数据，destinationType为base64时返回
				 */
				var img_url = ret.data;
				if (img_url != "") {
					//打开裁剪frame
					openImageClipFrame(img_url);
				}
			}
		});
	});
}

function openImageClipFrame(img_src) {
	api.openFrame({
		name : 'tu',
		scrollToTop : true,
		allowEdit : true,
		url : '../tu.html',
		rect : {
			x : 0,
			y : 0,
			w : api.winWidth,
			h : api.winHeight,
		},
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300
		},
		pageParam : {
			img_src : img_src
		},
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
}

function isOnLineStatus(callback) {
	var s = api.connectionType;
	s = s.toLowerCase();
	if (s == 'wifi' || s == '3g' || s == '4g' || s == '2g') {
		callback(true, s);
	} else {
		callback(false, s);
	}
}

function audioCover(duration, songName, artists, per) {
	var objj = api.require('audioCover');
	var uul = $api.getStorage('uulr');
	var msg = {
		totalTime : duration,
		cover : uul,
		progress : per,
		audio : songName,
		author : artists,
	}
	objj.set(msg, function(ret, err) {
		if (ret.eventType == 'pause') {
			//			pause();
			play();
		} else if (ret.eventType == 'next') {
			stop();
			next()
		} else if (ret.eventType == 'previous') {
			stop();
			prev()
		} else if (ret.eventType == 'play') {
			//			play()
			pause();
		} else {
		}
	});
}

function songCache(mp3) {
	var pp = api.cacheDir

	var cachePath = $api.getStorage('path');

	api.download({
		savePath : pp,
		url : mp3,
		report : true,
		cache : true,
		allowResume : true,
	}, function(ret, err) {
		if (ret) {

			var state = ret.state
			var pers = parseInt(ret.percent)
			var path = ret.savePath
			$api.setStorage('path', path);
			setTimeout(api.showProgress({
				title : '缓存' + pers + '%',
				text : '先喝杯茶...',
				modal : false
			}), 2000);

			switch(state) {

				case 0:
					var bb = $api.getStorage('play');
					if (bb) {

					} else {
						play(mp3);
						$api.setStorage('play', 0);
						api.toast({
							msg : '.'
						});
					}

					break;
				default :
					api.hideProgress();
					var aa = $api.getStorage('play');
					if (aa) {

					} else {
						play(path)
						api.toast({
							msg : '缓存播放'
						});
					}

			}
		} else {
			var value = err.msg;
		}
	});
	api.addEventListener({
		name : 'cancelDownload'
	}, function(ret, err) {
		api.cancelDownload({
			url : mp3
		});
	});
}

function changP() {
	var icon = $api.byId('playerIcon');
	$api.toggleCls(icon, 'icon-play');
}